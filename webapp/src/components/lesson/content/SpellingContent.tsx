import React from "react";
import { Volume2 } from "lucide-react";

interface SpellingContentProps {
  onSpeakText: (text: string) => void;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  randomWord: string;
}

export function SpellingContent({
  onSpeakText,
  userAnswer,
  onAnswerChange,
  randomWord,
}: SpellingContentProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <button
          onClick={() => onSpeakText(randomWord)}
          className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-md hover:bg-blue-200"
        >
          <Volume2 className="h-8 w-8 text-blue-600" />
        </button>
        <p className="text-sm text-gray-600">Tap to listen</p>
      </div>

      <div className="w-full">
        <p className="mb-2 text-center text-gray-700">
          Spell the word you hear:
        </p>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="w-full rounded-xl border-2 border-gray-300 p-4 text-center text-xl focus:border-blue-500 focus:outline-none"
          placeholder="Type your answer..."
        />
      </div>
    </div>
  );
}
