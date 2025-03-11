import React from "react";

interface WritingActivityContentProps {
  instructions: string;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
}

export function WritingActivityContent({
  instructions,
  userAnswer,
  onAnswerChange,
}: WritingActivityContentProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-center text-lg text-gray-700">{instructions}</p>
      <textarea
        value={userAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        className="w-full rounded-xl border-2 border-gray-300 p-4 text-xl focus:border-blue-500 focus:outline-none"
        placeholder="Type your answer here..."
        rows={4}
      />
    </div>
  );
}
