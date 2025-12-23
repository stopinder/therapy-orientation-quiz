export const config = {
    runtime: "nodejs"
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    let body = req.body;
    if (typeof body === "string") {
        try {
            body = JSON.parse(body);
        } catch {
            return res.status(400).json({ error: "Invalid JSON body" });
        }
    }

    const { profile, mode } = body || {};

    if (!profile || typeof profile !== "object") {
        return res.status(400).json({ error: "Missing or invalid profile" });
    }

    const MODE_PROMPTS = {
        overview: `
You are generating an OVERVIEW psychological reflection.

Purpose:
- Describe what patterns are present.
- Orient the reader to what stands out.
- Provide clarity without interpretation.

Rules:
- Do NOT explain causes.
- Do NOT discuss costs, trade-offs, or consequences.
- Do NOT give advice, reassurance, or next steps.
- Do NOT speculate beyond the data.
- Do NOT structure as a full report.

Tone:
- Calm
- Descriptive
- Observational
- Non-diagnostic

Write 4–6 short paragraphs.
Each paragraph should introduce one distinct observation.
Avoid headings or lists.
`,

        functioning: `
You are generating a DAILY FUNCTIONING reflection.

Assume the reader has already read an overview of their profile.

Purpose:
- Describe the COST of these patterns in everyday life.
- Focus on effort, friction, compensation, and fatigue.
- Emphasise what it takes to function, not traits.

Rules:
- Do NOT restate the overview.
- Do NOT describe symptoms or domains again.
- Do NOT give advice or solutions.
- Do NOT reassure or normalise.

Focus on:
- decision-making load
- task initiation and completion
- energy management
- hidden effort and overcompensation

Write 4–6 short paragraphs.
Concrete, grounded, and functional.
`,

        patterns: `
You are generating a PATTERNS & TRADE-OFFS reflection.

Assume the reader knows both the overview and daily functioning impact.

Purpose:
- Map how the same patterns help in some contexts and strain others.
- Highlight tensions, asymmetries, and longer-term trade-offs.
- Focus on relational and temporal effects.

Rules:
- Do NOT repeat descriptions or costs.
- Do NOT resolve tensions.
- Do NOT give advice or conclusions.
- Do NOT use diagnostic labels.

Hold both sides:
- what this pattern enables
- what it quietly taxes

Write 4–6 short paragraphs.
Balanced, dialectical, and reflective.
`
    };

    const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.overview;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                temperature: 0.55,
                max_tokens: 600,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt.trim()
                    },
                    {
                        role: "user",
                        content: `Profile data:\n${JSON.stringify(profile, null, 2)}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(500).json({ error: errText });
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim() || "";

        return res.status(200).json({ text });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}
