"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
  const [message, setMessage] = useState("Waiting for data...");

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("serialData", (data) => {
      setMessage(data);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Arduino Serial Data</h1>
      <p className="text-lg">{message}</p>
    </main>
  );
}
