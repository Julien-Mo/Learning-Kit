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
      if (message.trim()) {
        console.log("Received:", message.trim());
        io.emit("serialData", message.trim()); // Send complete messages
      }
    });
  }
});

server.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});
