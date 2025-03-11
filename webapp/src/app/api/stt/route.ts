import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import * as fs from "fs";

// Initialize the ElevenLabs client
const client = new ElevenLabsClient({
  apiKey: "sk_3f31bd83481e1f87e5cd4e11cf0a074fb165ca09757b006a",
});

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Create a new FormData object to send to Eleven Labs
    const elevenlabsFormData = new FormData();
    elevenlabsFormData.append("audio", audioFile);

    // Optional parameters for the API
    elevenlabsFormData.append("model_id", "eleven_english_v2"); // Use their English model

    // Make the request to Eleven Labs API
    const response = await client.speechToText.convert({
      file: audioFile,
      model_id: "scribe_v1",
    });

    return NextResponse.json({
      words: response.words,
      text: response.text,
      language: {
        name: response.language_code,
        confidence: response.language_probability,
      },
    });
  } catch (error) {
    console.error("Error in STT API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
