import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { deterministicReport, dimensionSummaries } = req.body;

    if (!deterministicReport || !dimensionSummaries) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    const messages = [
        { role: "system", content: SYSTEM_PROMPT_V1 },
        {
            role: "user",
            content: buildContextPayload(deterministicReport, dimensionSummaries)
        },
        { role: "user", content: OUTPUT_CONTRACT_V1 }
    ];

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.4
    });

    res.status(200).json({
        text: completion.choices[0].message.content
    });
}
