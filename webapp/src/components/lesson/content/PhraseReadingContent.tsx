import React from "react";
import { Mic, StopCircle } from "lucide-react";

interface PhraseReadingContentProps {
  phrase: string;
  isListening: boolean;
  onToggleRecording: () => void;
}

export function PhraseReadingContent({
  phrase,
  isListening,
  onToggleRecording,
}: PhraseReadingContentProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex min-h-[10rem] w-full items-center justify-center rounded-2xl bg-gray-100 p-6 text-3xl font-medium">
        {phrase}
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={onToggleRecording}
          className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
            isListening ? "bg-red-100" : "bg-blue-100"
          } shadow-md hover:${isListening ? "bg-red-200" : "bg-blue-200"}`}
          aria-label={isListening ? "Stop recording" : "Start recording"}
        >
          {isListening ? (
            <StopCircle className="h-8 w-8 text-red-600" />
          ) : (
            <Mic className="h-8 w-8 text-blue-600" />
          )}
        </button>
        <p className="text-sm text-gray-600">
          {isListening ? "Tap to stop" : "Tap to speak"}
        </p>
      </div>
    </div>
  );
}
