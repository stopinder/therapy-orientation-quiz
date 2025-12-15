import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { deterministicReport } = req.body;

    if (!deterministicReport) {
        return res.status(400).json({ error: "Missing report" });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            temperature: 0.4,
            messages: [
                {
                    role: "system",
                    content:
                        "You are expanding an existing reflective report. Do not add diagnoses, advice, or new interpretations."
                },
                {
                    role: "user",
                    content: deterministicReport
                }
            ]
        });

        return res.status(200).json({
            text: completion.choices[0].message.content
        });
    } catch (err) {
        console.error("OpenAI error:", err);
        return res.status(500).json({ error: "AI generation failed" });
    }
}
