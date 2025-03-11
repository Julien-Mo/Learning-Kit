"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { playSound, textToSpeech, startRecording, transcribeAudio, RecordingController } from "@/lib/utils";
import { checkAnswerCorrectness, isCheckDisabled, getRandomItemFromArray } from "@/lib/lesson-utils";
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
      
      // Get the audio blob from the recording
      const audioBlob = await recordingController.getAudioBlob();
      setRecordingController(null);
      
      if (audioBlob) {
        // Show loading state while transcribing
        setUserAnswer("Transcribing...");
        
        // Transcribe the audio using our API
        const transcription = await transcribeAudio(audioBlob);
        
        if (transcription.words.length > 0) {
          // Use the transcribed text as the answer
          setUserAnswer(transcription.text);
        } else {
          setUserAnswer("No speech detected. Please try again.");
        }
      } else {
        setUserAnswer("Recording failed. Please try again.");
      }
    }
    // Start recording
    else {
      setIsListening(true);
      setUserAnswer("");
      const controller = startRecording();
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

  const handleRetry = () => {
    // Reset the answer state
    setIsCorrect(null);
    setUserAnswer("");
    
    // If the content type requires listening first, reset that state too
    if (currentContent?.type === "introduction" || currentContent?.type === "spelling") {
      setHasListened(false);
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
            onRetry={handleRetry}
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
