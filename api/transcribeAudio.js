export const config = {
    runtime: "nodejs"
}

export default async function handler(request, response) {

    if (request.method !== "POST") {

        return response.status(405).json({
            error: "Method not allowed"
        })

    }

    try {

        const { audio, mimeType } = request.body || {}

        if (!audio || typeof audio !== "string") {

            return response.status(400).json({
                error: "Audio recording is required"
            })

        }

        if (!process.env.OPENAI_API_KEY) {

            return response.status(500).json({
                error: "Missing OpenAI API key"
            })

        }

        const base64Audio = audio.includes(",")
            ? audio.split(",")[1]
            : audio

        const audioBuffer = Buffer.from(base64Audio, "base64")

        const audioBlob = new Blob(
            [audioBuffer],
            {
                type: mimeType || "audio/webm"
            }
        )

        const formData = new FormData()

        formData.append("model", "whisper-1")

        formData.append(
            "file",
            audioBlob,
            "mindworks-reflection.webm"
        )

        const transcriptionResponse = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: formData
            }
        )

        const data = await transcriptionResponse.json()

        if (!transcriptionResponse.ok) {

            console.error("TRANSCRIPTION ERROR:", data)

            return response.status(500).json({
                error:
                    data.error?.message ||
                    "Transcription failed"
            })

        }

        return response.status(200).json({
            transcript: data.text || ""
        })

    } catch (error) {

        console.error("AUDIO TRANSCRIPTION ERROR:", error)

        return response.status(500).json({
            error:
                error.message ||
                "Audio transcription failed"
        })

    }

}