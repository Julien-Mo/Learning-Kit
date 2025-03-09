"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Volume2, Check, X, Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  playSound,
  textToSpeech,
  startMockRecording,
  RecordingController,
  getCurrentRecordingPromise,
} from "@/lib/utils";
import type { LessonsData, LessonContent } from "@/lib/types";

export default function LessonPage() {
  const params = useParams();
  const lessonId = Number(params.id);

  const [lessons, setLessons] = useState<LessonsData | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [recordingController, setRecordingController] =
    useState<RecordingController | null>(null);

  useEffect(() => {
    // Load lesson data
    import("@/lib/lessons.json")
      .then((data) => {
        setLessons(data as LessonsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load lessons:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Reset state when moving to a new content item
    setHasListened(false);
    setUserAnswer("");
    setIsCorrect(null);
  }, [currentContentIndex]);

  const currentLesson = lessons?.lessons.find(
    (lesson) => lesson.id === lessonId
  );
  const currentContent = currentLesson?.content[currentContentIndex];
  const totalContentItems = currentLesson?.content.length || 0;
  const progress = ((currentContentIndex + 1) / totalContentItems) * 100;

  const handleSpeakText = async (text: string) => {
    try {
      // Use our updated textToSpeech function
      const url = await textToSpeech(text);

      // Store the URL for cleanup later
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(url);
      setHasListened(true);

      // Play the audio
      if (url) {
        const audio = new Audio(url);
        await audio.play();
      }
    } catch (error) {
      console.error("Failed to speak text:", error);
    }
  };

  const handleToggleRecording = async () => {
    // If already recording, stop it
    if (isListening && recordingController) {
      recordingController.stopRecording();
      setIsListening(false);
      setRecordingController(null);

      // Generate appropriate answer based on content type
      if (currentContent?.type === "introduction") {
        setUserAnswer(currentContent.keyword);
      } else if (
        currentContent?.type === "wordReading" &&
        currentContent.words.length > 0
      ) {
        const randomIndex = Math.floor(
          Math.random() * currentContent.words.length
        );
        setUserAnswer(currentContent.words[randomIndex]);
      } else if (
        currentContent?.type === "phraseReading" &&
        currentContent.phrases.length > 0
      ) {
        const randomIndex = Math.floor(
          Math.random() * currentContent.phrases.length
        );
        setUserAnswer(currentContent.phrases[randomIndex]);
      } else if (
        currentContent?.type === "sentenceReading" &&
        currentContent.sentences.length > 0
      ) {
        const randomIndex = Math.floor(
          Math.random() * currentContent.sentences.length
        );
        setUserAnswer(currentContent.sentences[randomIndex]);
      } else {
        setUserAnswer("Recording completed");
      }
    }
    // Start recording
    else {
      setIsListening(true);
      setUserAnswer("");
      const controller = startMockRecording();
      setRecordingController(controller);
    }
  };

  const checkAnswer = () => {
    // This is a simplified check - you'll need to adapt this based on your content types
    let correct = false;

    if (
      currentContent?.type === "wordReading" ||
      currentContent?.type === "spelling"
    ) {
      // For simplicity, just check if the answer matches any word
      correct = (currentContent.words || []).some(
        (word) => word.toLowerCase() === userAnswer.toLowerCase()
      );
    } else if (currentContent?.type === "phraseReading") {
      correct = (currentContent.phrases || []).some(
        (phrase) => phrase.toLowerCase() === userAnswer.toLowerCase()
      );
    } else if (currentContent?.type === "sentenceReading") {
      correct = (currentContent.sentences || []).some(
        (sentence) => sentence.toLowerCase() === userAnswer.toLowerCase()
      );
    } else if (currentContent?.type === "introduction") {
      // For introduction, just check if they said the keyword
      correct = userAnswer
        .toLowerCase()
        .includes(currentContent.keyword.toLowerCase());
    } else if (
      currentContent?.type === "activity" &&
      currentContent.activityType === "writing"
    ) {
      // For writing activities, just set as correct if they typed something
      correct = userAnswer.trim().length > 0;
    } else {
      // For other types, just set as correct for demo purposes
      correct = true;
    }

    setIsCorrect(correct);
    playSound(correct ? "correct" : "incorrect");
  };

  const handleNext = () => {
    if (currentContentIndex < totalContentItems - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
      setUserAnswer("");
      setIsCorrect(null);
      setHasListened(false);
    } else {
      // Lesson complete, redirect to summary or dashboard
      // For now, just go back to the dashboard
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!currentLesson || !currentContent) {
    return (
      <div className="flex h-screen items-center justify-center">
        Lesson not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </Button>
          </Link>
          <div className="ml-4 flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {currentLesson.name}
            </h1>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200">
        <div
          className="h-2 bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Question */}
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
            {currentContent.type === "introduction"
              ? `Learn the letter ${currentContent.letter}`
              : currentContent.type === "wordReading"
              ? currentContent.title
              : currentContent.type === "phraseReading"
              ? currentContent.title
              : currentContent.type === "sentenceReading"
              ? currentContent.title
              : currentContent.type === "spelling"
              ? currentContent.title
              : "What sound does this make?"}
          </h2>

          {/* Content based on type */}
          <div className="mb-8">{renderContent(currentContent)}</div>

          {/* Answer Area */}
          {userAnswer && (
            <div className="mb-8 text-center">
              <p className="text-xl font-medium text-gray-700">{userAnswer}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            {isCorrect === null ? (
              <Button
                className="h-14 rounded-full bg-blue-500 px-8 py-4 text-lg font-medium text-white shadow-md hover:bg-blue-600 disabled:bg-gray-300"
                onClick={checkAnswer}
                disabled={
                  (currentContent.type === "introduction" && !hasListened) ||
                  (currentContent.type === "spelling" && !hasListened) ||
                  userAnswer.trim() === ""
                }
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
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function renderContent(content: LessonContent) {
    switch (content.type) {
      case "introduction":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-2xl bg-gray-100 text-6xl font-bold">
              {content.letter}
            </div>

            <p className="mb-4 text-center text-xl">
              <span className="font-bold">{content.keyword}</span> -{" "}
              {content.sound}
            </p>

            <div className="mb-6 flex flex-col items-center">
              <button
                onClick={() =>
                  handleSpeakText(
                    `${content.letter}. ${content.keyword}. ${content.sound}`
                  )
                }
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
                  onClick={handleToggleRecording}
                  className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                    isListening ? "bg-red-100" : "bg-blue-100"
                  } shadow-md hover:${
                    isListening ? "bg-red-200" : "bg-blue-200"
                  }`}
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

      case "wordReading":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-40 w-full items-center justify-center rounded-2xl bg-gray-100 text-5xl font-bold">
              {content.words[0]}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={handleToggleRecording}
                className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                  isListening ? "bg-red-100" : "bg-blue-100"
                } shadow-md hover:${
                  isListening ? "bg-red-200" : "bg-blue-200"
                }`}
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

      case "phraseReading":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex min-h-[10rem] w-full items-center justify-center rounded-2xl bg-gray-100 p-6 text-3xl font-medium">
              {content.phrases[0]}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={handleToggleRecording}
                className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                  isListening ? "bg-red-100" : "bg-blue-100"
                } shadow-md hover:${
                  isListening ? "bg-red-200" : "bg-blue-200"
                }`}
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

      case "sentenceReading":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex min-h-[10rem] w-full items-center justify-center rounded-2xl bg-gray-100 p-6 text-2xl font-medium">
              {content.sentences[0]}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={handleToggleRecording}
                className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                  isListening ? "bg-red-100" : "bg-blue-100"
                } shadow-md hover:${
                  isListening ? "bg-red-200" : "bg-blue-200"
                }`}
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

      case "spelling":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex flex-col items-center">
              <button
                onClick={() =>
                  handleSpeakText(
                    content.words[
                      Math.floor(Math.random() * content.words.length)
                    ]
                  )
                }
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
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 p-4 text-center text-xl focus:border-blue-500 focus:outline-none"
                placeholder="Type your answer..."
              />
            </div>
          </div>
        );

      case "activity":
        if (content.activityType === "writing") {
          return (
            <div className="flex flex-col items-center">
              <p className="mb-4 text-center text-lg text-gray-700">
                {content.instructions}
              </p>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 p-4 text-xl focus:border-blue-500 focus:outline-none"
                placeholder="Type your answer here..."
                rows={4}
              />
            </div>
          );
        }

        return (
          <div className="text-center">
            <p className="text-lg text-gray-700">{content.instructions}</p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-gray-700">Unknown content type</p>
          </div>
        );
    }
  }
}
