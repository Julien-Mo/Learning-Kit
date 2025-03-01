import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function textToSpeech(text: string): Promise<string> {
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate speech");
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Error generating speech:", error);
    return "";
  }
}

export function playSound(soundType: "correct" | "incorrect") {
  const audio = new Audio(`/sounds/${soundType}.mp3`);
  audio.play().catch((err) => console.error("Failed to play sound:", err));
}

// Interface for the recording controller
export interface RecordingController {
  stopRecording: () => void;
  isRecording: boolean;
}

// Global recording controller
let currentRecordingController: RecordingController | null = null;

// Start mock recording and return a controller to stop it
export function startMockRecording(): RecordingController {
  // If there's already a recording in progress, stop it
  if (currentRecordingController && currentRecordingController.isRecording) {
    currentRecordingController.stopRecording();
  }

  // Create a new controller
  let resolvePromise: (value: string) => void;
  const recordingPromise = new Promise<string>((resolve) => {
    resolvePromise = resolve;
  });

  const controller: RecordingController = {
    isRecording: true,
    stopRecording: () => {
      if (controller.isRecording) {
        controller.isRecording = false;
        resolvePromise("Recording completed");
        currentRecordingController = null;
      }
    },
  };

  // Store the current controller globally
  currentRecordingController = controller;

  return controller;
}

// Get the current recording promise
export function getCurrentRecordingPromise(): Promise<string> | null {
  if (!currentRecordingController || !currentRecordingController.isRecording) {
    return null;
  }

  return new Promise<string>((resolve) => {
    const checkInterval = setInterval(() => {
      if (
        !currentRecordingController ||
        !currentRecordingController.isRecording
      ) {
        clearInterval(checkInterval);
        resolve("Recording completed");
      }
    }, 100);
  });
}

// Type declaration for the Speech Recognition API (kept for reference)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
