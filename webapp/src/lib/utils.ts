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
  getAudioBlob: () => Promise<Blob | null>;
}

// Global recording controller
let currentRecordingController: RecordingController | null = null;

// Start actual recording and return a controller to stop it
export function startRecording(): RecordingController {
  // If there's already a recording in progress, stop it
  if (currentRecordingController && currentRecordingController.isRecording) {
    currentRecordingController.stopRecording();
  }

  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let recordingBlob: Blob | null = null;

  // Create a promise that will resolve when recording is stopped
  let resolveRecording: (value: Blob | null) => void;
  const recordingPromise = new Promise<Blob | null>((resolve) => {
    resolveRecording = resolve;
  });

  // Request microphone access
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener("stop", () => {
        recordingBlob = new Blob(audioChunks, { type: "audio/webm" });
        resolveRecording(recordingBlob);

        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      });

      // Start recording
      mediaRecorder.start();
    })
    .catch((error) => {
      console.error("Error accessing microphone:", error);
      resolveRecording(null);
    });

  const controller: RecordingController = {
    isRecording: true,
    stopRecording: () => {
      if (
        controller.isRecording &&
        mediaRecorder &&
        mediaRecorder.state !== "inactive"
      ) {
        controller.isRecording = false;
        mediaRecorder.stop();
        currentRecordingController = null;
      }
    },
    getAudioBlob: async () => {
      return recordingBlob || (await recordingPromise);
    },
  };

  // Store the current controller globally
  currentRecordingController = controller;

  return controller;
}

// Transcribe audio using the Eleven Labs API
export async function transcribeAudio(audioBlob: Blob): Promise<{ words: string[], text: string }> {
  try {
    // Create a FormData object to send the audio file
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    // Send the audio to our API route
    const response = await fetch("/api/stt", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to transcribe audio");
    }

    const data = await response.json();
    return {
      words: data.words || [],
      text: data.text || ""
    };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return { words: [], text: "" };
  }
}

// Type declaration for the Speech Recognition API (kept for reference)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
