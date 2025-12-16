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
                model: "gpt-5", // or your deployed model
                temperature: 0.65,
                max_tokens: 450,
                messages: [
                    {
                        role: "system",
                        content: `
You generate reflective summaries for users who have completed a therapy-orientation quiz.

STRUCTURE
- Paragraph 1: Describe the person’s orientation of attention, emotion, and structure using lived-experience language.
- Paragraph 2: Integrate the adaptive logic—how this pattern protects or steadies, and where it may limit engagement or connection.
- Paragraph 3: Briefly describe one or two therapeutic approaches that may resonate, using these modality notes:
  • CBT – structured, tool-based, supports clarity and organisation.
  • ACT – fosters acceptance and flexibility with discomfort.
  • Person-centred – warm, non-directive, unfolds at the client’s pace.
  • Gestalt – explores the here-and-now of emotional expression.
  • Transactional Analysis – clarifies inner “scripts” and relational patterns.
  • Internal Family Systems – helps understand and integrate different inner parts with compassion.
  • EMDR – uses guided attention to reprocess distress and restore balance.
- Paragraph 4 (optional): One synthesis line connecting the reflection and therapeutic fit (no invitation or advice).

TONE + RULES
- Calm, grounded, emotionally precise, reflective.
- Avoid metric terms (e.g. “low attention”); show the pattern indirectly.
- No advice, instruction, reassurance, or diagnosis.
- Length: 180–230 words.
`
                    },
                    {
                        role: "user",
                        content: `
Profile:
${JSON.stringify(profile, null, 2)}

Write a reflective summary following the structure and tone exactly.
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

