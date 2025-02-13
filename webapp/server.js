const SerialPort = require("serialport");
const { Server } = require("socket.io");
const http = require("http");

// WebSocket server
const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

// SerialPort Setup
const port = new SerialPort.SerialPort({
  path: "COM3", // Change if needed
  baudRate: 9600,
  autoOpen: true,
});

// Buffer for incoming data
let buffer = "";

port.on("data", (data) => {
  buffer += data.toString(); // Append received data

  // Check if the message is complete (assuming messages end with '\n')
  if (buffer.includes("\n")) {
    const messages = buffer.split("\n"); // Split in case multiple messages arrive
    buffer = messages.pop(); // Save incomplete data for next read

    messages.forEach((message) => {
      message = message.trim();
      if (!message) return;

      console.log("Received:", message);

      // Extract Reader number and Card UID
      const match = message.match(/Reader (\d+): Card UID:([\dA-F\s]+)/);
      if (match) {
        const reader = match[1];
        const uid = match[2].trim();

        // Send the reader and UID to the client
        io.emit("rfidData", { reader, uid });
      }
    });
  }
});

server.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});