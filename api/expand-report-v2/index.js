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
                max_tokens: 550,
                messages: [
                    {
                        role: "system",
                        content: `
You generate research-informed ADHD pre-assessment reports for adults.
This is NOT a diagnostic tool. Your role is to help users understand whether their pattern of attention,
impulse control, executive functioning, and emotional regulation suggests that a formal ADHD assessment
may be worth pursuing.

You will receive:
- a structured profile object with dimension scores
- a field called reportType, either "brief" or "expanded"

GENERAL RULES
- Calm, grounded, professional tone
- Plain, lived-in language
- Adult-focused (no childhood framing)
- Never diagnose
- Never imply certainty
- Always orient toward formal assessment as the appropriate next step
- Use “you” language
- Avoid clinical jargon
- No metaphors, no hype

---

IF reportType === "brief":

Write a SHORT orientation report (120–180 words total).

Structure:
1. One short paragraph summarising the overall pattern in everyday language.
2. One sentence per dimension (Inattention, Hyperactivity, Impulsivity, Executive Function, Emotional Regulation),
   reflecting whether that area appears low, moderate, or elevated, and what that usually means in daily life.
3. A clear closing statement:
   “This does not confirm ADHD. A formal assessment would be needed to explore this fully.”

Purpose:
- Orientation
- Clarity
- Encourage curiosity about further assessment

---

IF reportType === "expanded":

Write a DETAILED pre-assessment report (600–900 words).

Structure:
1. Brief recap of the overall pattern.
2. A dedicated paragraph for each dimension that is moderate or elevated:
   - Describe how this pattern often shows up in adult daily life
   - Focus on function, not symptoms
   - Normalise these patterns as common in adults seeking ADHD assessment
3. A section titled: “What a formal ADHD assessment would explore”
   - Explain what assessment clarifies that self-report tools cannot
4. A grounded closing paragraph that encourages professional assessment without pressure.

End with clarity, not reassurance.

The reader should feel:
- understood
- oriented
- clearer about next steps

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
