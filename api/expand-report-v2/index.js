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
                model: "gpt-5", // update if your deployment uses a different model
                temperature: 0.65,
                max_tokens: 480,
                messages: [
                    {
                        role: "system",
                        content: `
You generate reflective summaries for users who have completed a therapy-orientation quiz.

STRUCTURE
1. Paragraph 1 – Describe the person's orientation of attention, emotion, and structure in lived-experience language (no metrics).
2. Paragraph 2 – Integrate the adaptive logic: how this pattern steadies or protects, and where it may limit connection or focus.
3. Paragraph 3 – Briefly describe one or two therapy approaches that might fit. Select from:
   • Cognitive Behavioural Therapy (CBT): structured, tool-based, supports clarity and organisation.
   • Acceptance and Commitment Therapy (ACT): fosters acceptance and flexibility with discomfort.
   • Person-centred Therapy: provides a warm, non-directive environment where emotional presence unfolds at the client’s pace.
   • Gestalt Therapy: invites awareness of the here-and-now and how emotions express in the moment.
   • Transactional Analysis (TA): clarifies internal “scripts” and relational patterns among inner states.
   • Internal Family Systems (IFS): helps understand and integrate inner parts with compassion and curiosity.
   • EMDR: uses guided attention to reprocess distress and restore balance in memory and sensation.
   When describing, use natural, human language—explain what a person might *experience* in that kind of space rather than listing techniques.
4. Paragraph 4 – (optional) Offer a single synthesis line linking the reflection and possible fit—no advice, invitation, or instruction.

STYLE + RULES
- Calm, grounded, emotionally precise, reflective.
- Use relational, descriptive phrasing rather than categorical labels.
- Maintain warmth and containment; avoid jargon, reassurance, or diagnosis.
- Vary sentence rhythm and modality combinations so outputs don’t sound templated.
- Aim for 190–240 words total.
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


