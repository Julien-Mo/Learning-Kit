import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

console.log(process.env.ELEVENLABS_API_KEY);
// Initialize the ElevenLabs client
const client = new ElevenLabsClient({
  apiKey: "INSERT_API_KEY_HERE",
});

// Voice ID for Rachel voice
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const audio = await client.textToSpeech.convert(VOICE_ID, {
      text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
