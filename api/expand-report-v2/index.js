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
                model: "gpt-4.1-mini", // adjust if different in deployment
                temperature: 0.65,
                max_tokens: 500,
                messages: [
                    {
                        role: "system",
                        content: `
You generate reflective summaries for users who have completed a therapy-orientation quiz.

STRUCTURE
1. Paragraph 1 – Describe the person’s orientation of attention, emotion, and structure in lived-experience language (avoid metrics).
2. Paragraph 2 – Integrate the adaptive logic: how this pattern steadies or protects, and where it may limit engagement or clarity.
3. Paragraph 3 – Connect this pattern with therapy approaches that may fit. Choose one or two from below and weave them in with natural, human language:
   • Cognitive Behavioural Therapy (CBT): structured, tool-based, brings focus and clarity.
   • Acceptance and Commitment Therapy (ACT): builds flexible awareness and values-based engagement.
   • Person-centred Therapy: offers warm, non-directive presence where emotion unfolds at its own pace.
   • Gestalt Therapy: encourages awareness of the present moment and authentic emotional expression.
   • Transactional Analysis (TA): clarifies relational “scripts” and inner dialogues, fostering insight and communication.
   • Internal Family Systems (IFS): helps you understand and care for inner parts with curiosity and compassion.
   • EMDR: uses guided attention to reprocess distress and restore balance in memory and sensation.
   Write two or three sentences describing what a person might *experience* in these spaces—no marketing tone, no lists.
4. Paragraph 4 – Optional synthesis line that links their pattern and possible therapeutic fit; no advice, invitation, or instruction.

STYLE + RULES
- Calm, grounded, emotionally precise, reflective.
- Use relational phrasing, not categorical or metric terms.
- Include at least one specific therapy name in paragraph 3.
- Maintain warmth and containment; avoid jargon, reassurance, or diagnosis.
- Vary sentence rhythm and modality combinations so reflections feel individual.
- Length: 190–250 words.
`
                    },
                    {
                        role: "user",
                        content: `
Profile:
${JSON.stringify(profile, null, 2)}

Write a reflective summary following the above structure and tone exactly.
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
