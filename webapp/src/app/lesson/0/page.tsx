"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
  const [message, setMessage] = useState("Waiting for data...");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false); // Track if the current answer is correct
  const [isAnswered, setIsAnswered] = useState(false); // Track if the question has been answered correctly

  const questions = [
    { question: "Where does 'C' go in cat?", correctUID: "92 C8 C5 01", correctReader: "0" },
    { question: "Where does 'A' go in cat?", correctUID: "39 9A CD 01", correctReader: "0" },
  ];

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("rfidData", (data) => {
      const { reader, uid } = data;
      setMessage(`Reader ${reader}: UID ${uid}`);

      // Ignore new inputs if the question has already been answered correctly
      if (isAnswered) return;

      // Verify the UID and reader for the current question
      const currentQ = questions[currentQuestion];
      if (uid === currentQ.correctUID && reader === currentQ.correctReader) {
        setFeedback("✅ Correct! Click 'Next' to proceed.");
        setIsCorrect(true);
        setIsAnswered(true); // Mark the question as answered
      } else {
        setFeedback("❌ Incorrect! Try again.");
        setIsCorrect(false);
      }
    });

    return () => socket.disconnect();
  }, [currentQuestion, isAnswered]); // Re-run effect when currentQuestion or isAnswered changes

  const handleNextQuestion = () => {
    if (isCorrect) {
      setCurrentQuestion((prev) => prev + 1); // Move to the next question
      setFeedback(""); // Reset feedback
      setIsCorrect(false); // Reset correctness state
      setIsAnswered(false); // Reset answered state
    } else {
      setFeedback("Please provide the correct answer before proceeding.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Learning Kit</h1>
        <p className="text-lg">{message}</p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Question {currentQuestion + 1}</h2>
          <p className="text-lg">{questions[currentQuestion].question}</p>
          <p className="text-lg">{feedback}</p>
          {isCorrect && (
            <button
              onClick={handleNextQuestion}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
}