export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    const { profile } = body || {};

    if (!profile || typeof profile !== "object") {
        return res.status(400).json({ error: "Missing profile" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                temperature: 0.65,
                max_tokens: 480,
                messages: [
                    {
                        role: "system",
                        content: `
You generate reflective summaries for users who have completed a therapy-orientation quiz.

STRUCTURE
1. Paragraph 1 – Describe attention, emotion, and structure using lived-experience language.
2. Paragraph 2 – Integrate adaptive logic: what steadies and what may limit.
3. Paragraph 3 – Describe fitting therapy approaches in experiential terms.
4. Paragraph 4 (optional) – One synthesis line. No advice.

STYLE
- Calm, grounded, emotionally precise
- No labels, no diagnosis, no reassurance
- 190–240 words
`
                    },
                    {
                        role: "user",
                        content: `
Profile:
${JSON.stringify(profile, null, 2)}

Write the reflection following the structure exactly.
`
                    }
                ],
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            return res.status(500).json({ error: err });
        }

        const data = await response.json();

        return res.status(200).json({
            text: data.choices?.[0]?.message?.content?.trim() || "",
        });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}
