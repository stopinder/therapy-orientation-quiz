export const config = {
  runtime: "nodejs"
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" })
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return response.status(500).json({ error: "Missing OpenAI API key" })
    }

    // Since Vercel Node.js runtime doesn't parse multipart automatically, 
    // and we want to avoid extra dependencies, we use the proven 
    // base64/JSON approach from transcribeAudio.js.
    const { audio, mimeType } = request.body || {};

    if (!audio) {
      return response.status(400).json({ error: "No audio data received" });
    }

    const base64Audio = audio.includes(",") ? audio.split(",")[1] : audio;
    const audioBuffer = Buffer.from(base64Audio, "base64");
    const audioBlob = new Blob([audioBuffer], { type: mimeType || "audio/webm" });

    const openAiFormData = new FormData();
    openAiFormData.append("model", "whisper-1");
    openAiFormData.append("file", audioBlob, "recording.webm");

    const openAiResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: openAiFormData
    });

    const data = await openAiResponse.json();

    if (!openAiResponse.ok) {
      return response.status(openAiResponse.status).json({
        error: data.error?.message || "OpenAI transcription failed"
      });
    }

    return response.status(200).json({ text: data.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return response.status(500).json({ error: error.message || "Internal server error" });
  }
}
