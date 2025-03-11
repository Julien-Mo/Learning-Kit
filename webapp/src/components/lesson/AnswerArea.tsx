import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnswerAreaProps {
  userAnswer: string;
  isCorrect: boolean | null;
  onCheck: () => void;
  onNext: () => void;
  isCheckDisabled: boolean;
}

export function AnswerArea({
  userAnswer,
  isCorrect,
  onCheck,
  onNext,
  isCheckDisabled,
}: AnswerAreaProps) {
  return (
    <>
      {userAnswer && (
        <div className="mb-8 text-center">
          <p className="text-xl font-medium text-gray-700">{userAnswer}</p>
        </div>
      )}

      <div className="flex justify-center">
        {isCorrect === null ? (
          <Button
            className="h-14 rounded-full bg-blue-500 px-8 py-4 text-lg font-medium text-white shadow-md hover:bg-blue-600 disabled:bg-gray-300"
            onClick={onCheck}
            disabled={isCheckDisabled}
          >
            Check
          </Button>
        ) : (
          <div className="flex w-full justify-between">
            <div className="flex items-center">
              {isCorrect ? (
                <div className="flex items-center text-green-600">
                  <Check className="mr-2 h-6 w-6" />
                  <span className="text-lg font-medium">Correct!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <X className="mr-2 h-6 w-6" />
                  <span className="text-lg font-medium">Try again</span>
                </div>
              )}
            </div>
            <Button
              className="h-14 rounded-full bg-blue-500 px-8 py-4 text-lg font-medium text-white shadow-md hover:bg-blue-600"
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
