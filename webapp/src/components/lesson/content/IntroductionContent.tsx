import React from "react";
import { Volume2, Mic, StopCircle } from "lucide-react";

interface IntroductionContentProps {
  letter: string;
  keyword: string;
  sound: string;
  hasListened: boolean;
  isListening: boolean;
  onSpeakText: (text: string) => void;
  onToggleRecording: () => void;
}

export function IntroductionContent({
  letter,
  keyword,
  sound,
  hasListened,
  isListening,
  onSpeakText,
  onToggleRecording,
}: IntroductionContentProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-2xl bg-gray-100 text-6xl font-bold">
        {letter}
      </div>

      <p className="mb-4 text-center text-xl">
        <span className="font-bold">{keyword}</span> - {sound}
      </p>

      <div className="mb-6 flex flex-col items-center">
        <button
          onClick={() => onSpeakText(`${letter}. ${keyword}. ${sound}`)}
          className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-md hover:bg-blue-200"
        >
          <Volume2 className="h-8 w-8 text-blue-600" />
        </button>
        <p className="text-sm text-gray-600">Tap to listen</p>
      </div>

      {hasListened && (
        <div className="mt-4 flex flex-col items-center">
          <p className="mb-2 text-center text-gray-700">
            Now, repeat the word:
          </p>
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
      )}
    </div>
  );
}
