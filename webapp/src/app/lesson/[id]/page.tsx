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
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

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
    setRecognitionError(null);
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
      setRecognitionError(null);
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
      <header className="border-b border-[#ced1e5] bg-white p-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-[#344054]" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-[#f4ebff] p-1.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="#f4ebff" />
                <path
                  d="M26 14H14C12.8954 14 12 14.8954 12 16V24C12 25.1046 12.8954 26 14 26H26C27.1046 26 28 25.1046 28 24V16C28 14.8954 27.1046 14 26 14Z"
                  fill="#6941c6"
                />
                <path
                  d="M20 21C21.1046 21 22 20.1046 22 19C22 17.8954 21.1046 17 20 17C18.8954 17 18 17.8954 18 19C18 20.1046 18.8954 21 20 21Z"
                  fill="white"
                />
                <path
                  d="M16 21C17.1046 21 18 20.1046 18 19C18 17.8954 17.1046 17 16 17C14.8954 17 14 17.8954 14 19C14 20.1046 14.8954 21 16 21Z"
                  fill="white"
                />
                <path
                  d="M24 21C25.1046 21 26 20.1046 26 19C26 17.8954 25.1046 17 24 17C22.8954 17 22 17.8954 22 19C22 20.1046 22.8954 21 24 21Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#101828]">
              {currentLesson.name}
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200">
        <div
          className="h-2 bg-[#6941c6] transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          {renderContent(
            currentContent,
            handleSpeakText,
            userAnswer,
            setUserAnswer,
            handleToggleRecording,
            isListening,
            hasListened
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-[#ced1e5] bg-white p-4">
        <div className="mx-auto flex max-w-md justify-between">
          {isCorrect === null ? (
            <Button
              className="rounded-lg bg-primary px-6 py-2.5 text-white hover:bg-primary-muted"
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
            <>
              <div className="flex items-center">
                {isCorrect ? (
                  <div className="flex items-center text-green-600">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Correct!</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <X className="mr-2 h-5 w-5" />
                    <span>Try again</span>
                  </div>
                )}
              </div>
              <Button
                className="rounded-lg bg-primary px-6 py-2.5 text-white hover:bg-primary-muted"
                onClick={handleNext}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function renderContent(
  content: LessonContent,
  handleSpeakText: (text: string) => void,
  userAnswer: string,
  setUserAnswer: React.Dispatch<React.SetStateAction<string>>,
  handleToggleRecording: () => void,
  isListening: boolean,
  hasListened: boolean
) {
  switch (content.type) {
    case "introduction":
      return (
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#101828]">
            {content.letter}
          </h2>
          <p className="mb-6 text-lg text-[#344054]">
            {content.keyword} - {content.sound}
          </p>
          <button
            onClick={() =>
              handleSpeakText(
                `${content.letter}. ${content.keyword}. ${content.sound}`
              )
            }
            className="flex items-center justify-center mx-auto mb-4 h-12 w-12 rounded-full bg-[#f4ebff]"
          >
            <Volume2 className="h-6 w-6 text-[#6941c6]" />
          </button>
          <p className="text-[#667085] mb-6">{content.description}</p>

          {hasListened && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-[#667085]">
                Now, repeat the word:
              </p>
              <button
                onClick={handleToggleRecording}
                className={`flex items-center justify-center mx-auto h-16 w-16 rounded-full ${
                  isListening ? "bg-red-100" : "bg-[#f4ebff]"
                } transition-colors duration-300`}
              >
                {isListening ? (
                  <StopCircle className="h-8 w-8 text-red-500" />
                ) : (
                  <Mic className="h-8 w-8 text-[#6941c6]" />
                )}
              </button>
              {userAnswer && (
                <p className="mt-3 text-[#344054] font-medium">{userAnswer}</p>
              )}
            </div>
          )}
        </div>
      );

    case "activity":
      return (
        <div className="text-center">
          <h2 className="mb-6 text-xl font-semibold text-[#101828]">
            Activity: {content.activityType}
          </h2>
          <p className="mb-8 text-[#344054]">{content.instructions}</p>
          {content.activityType === "writing" && (
            <div className="flex flex-col items-center">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-3 border border-[#ced1e5] rounded-lg min-h-[100px]"
                placeholder="Type your answer here..."
              />
            </div>
          )}
        </div>
      );

    case "wordReading":
      return (
        <div className="text-center">
          <h2 className="mb-6 text-xl font-semibold text-[#101828]">
            {content.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {content.words.map((word, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg border-[#ced1e5] hover:bg-[#f4ebff] cursor-pointer"
              >
                <p className="text-lg font-medium">{word}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-2 text-sm text-[#667085]">Read the words aloud:</p>
            <button
              onClick={handleToggleRecording}
              className={`flex items-center justify-center mx-auto h-16 w-16 rounded-full ${
                isListening ? "bg-red-100" : "bg-[#f4ebff]"
              } transition-colors duration-300`}
            >
              {isListening ? (
                <StopCircle className="h-8 w-8 text-red-500" />
              ) : (
                <Mic className="h-8 w-8 text-[#6941c6]" />
              )}
            </button>
            {userAnswer && (
              <p className="mt-3 text-[#344054] font-medium">{userAnswer}</p>
            )}
          </div>
        </div>
      );

    case "phraseReading":
      return (
        <div className="text-center">
          <h2 className="mb-6 text-xl font-semibold text-[#101828]">
            {content.title}
          </h2>
          <div className="space-y-4 mb-6">
            {content.phrases.map((phrase, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg border-[#ced1e5] hover:bg-[#f4ebff] cursor-pointer flex items-center justify-between"
              >
                <p className="text-lg font-medium">{phrase}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-2 text-sm text-[#667085]">
              Read the phrases aloud:
            </p>
            <button
              onClick={handleToggleRecording}
              className={`flex items-center justify-center mx-auto h-16 w-16 rounded-full ${
                isListening ? "bg-red-100" : "bg-[#f4ebff]"
              } transition-colors duration-300`}
            >
              {isListening ? (
                <StopCircle className="h-8 w-8 text-red-500" />
              ) : (
                <Mic className="h-8 w-8 text-[#6941c6]" />
              )}
            </button>
            {userAnswer && (
              <p className="mt-3 text-[#344054] font-medium">{userAnswer}</p>
            )}
          </div>
        </div>
      );

    case "sentenceReading":
      return (
        <div className="text-center">
          <h2 className="mb-6 text-xl font-semibold text-[#101828]">
            {content.title}
          </h2>
          <div className="space-y-4 mb-6">
            {content.sentences.map((sentence, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg border-[#ced1e5] hover:bg-[#f4ebff] cursor-pointer flex items-center justify-between"
              >
                <p className="text-lg font-medium">{sentence}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-2 text-sm text-[#667085]">
              Read the sentences aloud:
            </p>
            <button
              onClick={handleToggleRecording}
              className={`flex items-center justify-center mx-auto h-16 w-16 rounded-full ${
                isListening ? "bg-red-100" : "bg-[#f4ebff]"
              } transition-colors duration-300`}
            >
              {isListening ? (
                <StopCircle className="h-8 w-8 text-red-500" />
              ) : (
                <Mic className="h-8 w-8 text-[#6941c6]" />
              )}
            </button>
            {userAnswer && (
              <p className="mt-3 text-[#344054] font-medium">{userAnswer}</p>
            )}
          </div>
        </div>
      );

    case "spelling":
      return (
        <div className="text-center">
          <h2 className="mb-6 text-xl font-semibold text-[#101828]">
            {content.title}
          </h2>
          <div className="mb-6">
            <button
              onClick={() =>
                handleSpeakText(
                  content.words[
                    Math.floor(Math.random() * content.words.length)
                  ]
                )
              }
              className="flex items-center justify-center mx-auto h-16 w-16 rounded-full bg-[#f4ebff]"
            >
              <Volume2 className="h-8 w-8 text-[#6941c6]" />
            </button>
            <p className="mt-2 text-sm text-[#667085]">
              Click to hear the word
            </p>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-sm text-[#667085]">
              Spell the word you hear:
            </p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-2 border border-[#ced1e5] rounded-lg"
              placeholder="Type your answer..."
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center">
          <p className="text-[#667085]">Unknown content type</p>
        </div>
      );
  }
}
