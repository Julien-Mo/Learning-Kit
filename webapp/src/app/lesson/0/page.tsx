"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { playSound } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProgressBar } from "@/components/ui/ProgressBar";

const questions = [
  {
    question: "Where does 'C' go in cat?",
    correctUID: "6F BD 99 C3",
    correctReader: "2",
  },
  {
    question: "Where does 'A' go in cat?",
    correctUID: "8F 81 D5 C4",
    correctReader: "1",
  },
  {
    question: "Where does 'T' go in cat?",
    correctUID: "5F 67 15 C3",
    correctReader: "0",
  },
];

export default function LessonPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", isCorrect: false });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  // @ts-ignore
  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("rfidData", ({ reader, uid }) => {
      if (feedback.isCorrect) return;

      const isCorrect =
        uid === currentQuestion.correctUID &&
        reader === currentQuestion.correctReader;

      setFeedback({
        message: isCorrect ? "✅ Correct!" : "❌ Incorrect! Try again.",
        isCorrect,
      });
      playSound(isCorrect ? "correct" : "incorrect");
    });

    return () => socket.disconnect();
  }, [currentQuestionIndex, feedback.isCorrect, currentQuestion]);

  useEffect(() => {
    setFeedback({ message: "", isCorrect: false });
  }, [currentQuestionIndex]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Tile Matching" />
      <ProgressBar value={progress} />
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            {currentQuestion.question}
          </h2>
        </div>
      </div>
      <Footer
        feedback={feedback.message}
        isCorrect={feedback.isCorrect}
        onNext={handleNext}
      />
    </div>
  );
}
