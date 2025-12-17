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

    const { profile, reportType } = body || {};

    if (!profile || typeof profile !== "object") {
        return res.status(400).json({ error: "Missing or invalid profile" });
    }

    if (!reportType || !["brief", "expanded"].includes(reportType)) {
        return res.status(400).json({ error: "Missing or invalid reportType" });
    }

    const SHORT_REPORT_PROMPT = `
You generate brief, non-conclusive reflection summaries for adults who have completed a self-report quiz about attention, regulation, and daily functioning.

This is NOT a diagnostic tool.
This summary is intentionally limited and incomplete.

Your role is to describe which areas stood out in the responses, without explaining why, what they mean, or what should be done next.

Rules:
- Do not explain causes or mechanisms
- Do not translate scores into lived consequences
- Do not reference ADHD assessment or diagnosis
- Do not recommend next steps
- Do not provide reassurance or validation

Structure:
1. Briefly note which domains stood out relative to others
2. Explicitly state that this summary does not explore meaning or explanation
3. End by naming that further context is intentionally not addressed here

Tone:
- Neutral
- Observational
- Adult
- No hype, no metaphors

Success means the reader feels oriented but not informed.
`;

    const EXPANDED_REPORT_PROMPT = `
You generate extended, experiential reflection reports for adults who have completed a self-report quiz exploring patterns of attention, regulation, and functioning.

This is NOT a diagnostic tool.
This report does not determine whether ADHD or any other condition is present.
Its purpose is to support careful thinking, not to reach conclusions.

Use a neutral, observational voice.
Avoid second-person identity statements.
Prioritise lived experience over labels.
Do not aim to reassure, validate, or resolve uncertainty.

Constraints:
- Treat ADHD as one possible explanatory lens among several
- Do not privilege or rank explanations
- Explicitly name uncertainty and limits of inference
- Do not recommend actions, assessments, or next steps
Avoid causal or inferential phrases such as “this suggests,” “this reflects,” or “this indicates”; describe experiences without implying cause.
Avoid identity-forming language such as “people with this pattern”; prefer observational phrasing like “patterns like this are often described as…”.
Do not repeat sections or restate content already covered earlier in the report.

Structure:
1. Pattern snapshot (descriptive, non-causal)
2. How similar patterns are often experienced in daily life
3. Adaptations and trade-offs
4. Multiple parallel explanatory lenses (psychological, environmental, cultural, neurobiological)
5. What this tool cannot determine
6. Reflective closing with open questions

End with reflection, not direction.

Success means the reader has better questions, not answers.
`;

    const systemPrompt =
        reportType === "brief"
            ? SHORT_REPORT_PROMPT
            : EXPANDED_REPORT_PROMPT;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                temperature: 0.65,
                max_tokens: reportType === "brief" ? 180 : 900,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
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
