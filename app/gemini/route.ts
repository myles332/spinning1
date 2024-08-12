import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { URL } from "url";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a helpful assistant that writes short, artistic, insightful biographies for musical artists. You include specific facts about the artist.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const artistName = searchParams.get('artist');
    const chatSession = model.startChat({
      generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "Write 30 artistic-sounding, interesting words about musical artist LCD Soundsystem. It should provide a brief history, and sound like the artist themself wrote it from the third person."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "They started as a dance-punk outfit, a raucous, chaotic blast of feedback and synth hooks. But something else was brewing, a yearning for connection, a melancholic edge to the noise.  The lyrics grew sharp, introspective.  They built a sound that was both dance floor euphoria and post-industrial anxiety. They broke up, then reformed, returning with a renewed intensity, a testament to the enduring power of their sonic vision.  They are a band of contradictions, a sonic exploration of the human condition, a reminder that even in the darkest corners of our hearts, there’s always room for a good, cathartic dance. \n"},
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(`Write 30 artistic-sounding, interesting words about musical artist ${artistName}. It should provide a brief history, and sound like the artist themself wrote it from the third person.`);
    const text = result.response.text();
    return NextResponse.json({text});
  } catch (error) {
    console.log(error);
    return NextResponse.json({error});
  }
}