"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const questions = [
    { question: "Where does 'C' go in cat?", correctUID: "92 C8 C5 01", correctReader: "0" },
    { question: "Where does 'A' go in cat?", correctUID: "39 9A CD 01", correctReader: "0" },
  ];

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("rfidData", (data) => {
      const { reader, uid } = data;

      // Ignore new inputs if the current question is already answered correctly
      if (isCorrect) return;

      // Verify the UID and reader for the current question
      const currentQ = questions[currentQuestion];
      if (uid === currentQ.correctUID && reader === currentQ.correctReader) {
        setFeedback("✅ Correct!");
        setIsCorrect(true);
      } else {
        setFeedback("❌ Incorrect! Try again.");
      }
    });

    return () => socket.disconnect();
  }, [currentQuestion, isCorrect]); // Re-run effect when currentQuestion or isCorrect changes

  const handleNextQuestion = () => {
    if (isCorrect) {
      if (currentQuestion + 1 < questions.length) {
        // Move to the next question
        setCurrentQuestion((prev) => prev + 1);
        setFeedback("");
        setIsCorrect(false);
      } else {
        // If it's the last question, show completion message
        setFeedback("🎉 Congratulations! You've completed the lesson.");
      }
    }
  };

  const handleHome = () => {
    // Reset the quiz to the first question
    setCurrentQuestion(0);
    setFeedback("");
    setIsCorrect(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 p-4 text-white text-center">
        <h1 className="text-2xl font-bold">Learning Kit</h1>
      </header>

      {/* Centered Question */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        {currentQuestion < questions.length ? (
          <>
            <h2 className="text-xl font-semibold">Question {currentQuestion + 1}</h2>
            <p className="text-lg mt-2">{questions[currentQuestion].question}</p>
          </>
        ) : (
          <h2 className="text-xl font-semibold">Lesson Completed!</h2>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center">
        <p className="text-lg">{feedback}</p>
        {isCorrect && currentQuestion + 1 < questions.length && (
          <button
            onClick={handleNextQuestion}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        )}
        {isCorrect && currentQuestion + 1 === questions.length && (
          <button
            onClick={handleHome}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Home
          </button>
        )}
      </footer>
    </div>
  );
}