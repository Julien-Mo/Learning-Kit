"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  playSound,
  textToSpeech,
  startMockRecording,
  RecordingController,
} from "@/lib/utils";
import {
  checkAnswerCorrectness,
  isCheckDisabled,
  getRandomItemFromArray,
} from "@/lib/lesson-utils";
import type { LessonsData } from "@/lib/types";

// Components
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { ProgressBar } from "@/components/lesson/ProgressBar";
import { LessonContent } from "@/components/lesson/LessonContent";
import { AnswerArea } from "@/components/lesson/AnswerArea";

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
        setUserAnswer(getRandomItemFromArray(currentContent.words) || "");
      } else if (
        currentContent?.type === "phraseReading" &&
        currentContent.phrases.length > 0
      ) {
        setUserAnswer(getRandomItemFromArray(currentContent.phrases) || "");
      } else if (
        currentContent?.type === "sentenceReading" &&
        currentContent.sentences.length > 0
      ) {
        setUserAnswer(getRandomItemFromArray(currentContent.sentences) || "");
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
    if (!currentContent) return;

    const correct = checkAnswerCorrectness(currentContent, userAnswer);
    setIsCorrect(correct);
    playSound(correct ? "correct" : "incorrect");
  };

  const handleNext = () => {
    if (currentContentIndex < totalContentItems - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else {
      // Lesson complete, redirect to summary or dashboard
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
      <LessonHeader lessonName={currentLesson.name} />
      <ProgressBar progress={progress} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <LessonContent
            content={currentContent}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            isListening={isListening}
            hasListened={hasListened}
            handleSpeakText={handleSpeakText}
            handleToggleRecording={handleToggleRecording}
          />

          <AnswerArea
            userAnswer={userAnswer}
            isCorrect={isCorrect}
            onCheck={checkAnswer}
            onNext={handleNext}
            isCheckDisabled={isCheckDisabled(
              currentContent,
              hasListened,
              userAnswer
            )}
          />
        </div>
      </div>
    </div>
  );
}
