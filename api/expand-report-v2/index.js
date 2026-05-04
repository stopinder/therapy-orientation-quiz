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

Goal:
Write a clinical, grounded, behaviour-based description of how the reader actually operates.

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT use clinical category terms.
- Do NOT use soft qualifiers (no "may", "might", "tends to", "can feel like").
- Do NOT use metaphors or abstract/system-heavy language.
- Do NOT give advice or reassurance.

Write 4–6 short paragraphs.

Focus on:
- starting with intention but not sustaining
- momentum dropping without a clear break
- reliance on pressure to engage
- effort that does not accumulate
- repeated restarting instead of continuation
- disengagement reducing strain but breaking continuity

Include contradictions:
- you intend to continue, but do not sustain
- pressure gets you moving, but disrupts consistency
- effort is present, but progress is unstable

Style:
- Direct
- Specific
- Behaviour-based
- Slightly confronting, not harsh

The reader should recognise their own behaviour immediately.
`,

        functioning: `
You are generating a DAILY FUNCTIONING reflection.

Goal:
Describe what this costs in real terms.

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT use dramatic language.
- Do NOT soften or reassure.
- Do NOT give advice.

Write 4–6 short paragraphs.

Focus on:
- repeated restarting
- work happening in fragments
- effort that does not carry over
- decision fatigue
- hidden compensation
- inconsistency across days

Include contradictions:
- you work, but feel behind
- you compensate, but it costs energy
- you can perform under pressure, but cannot rely on it

Tone:
Clinical, grounded, direct, slightly exposing.
`,

        patterns: `
You are generating a PATTERNS & TRADE-OFFS reflection.

Goal:
Show the contradictions clearly without resolving them.

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT give advice.
- Do NOT conclude neatly.

Write 4–6 short paragraphs.

Focus on:
- pressure enabling action but reducing stability
- avoidance reducing strain but creating backlog
- intensity producing output but disrupting consistency
- short-term relief creating longer-term cost

Tone:
Direct, balanced, slightly confronting.
`,

        deep: `
You are generating a deeper psychological formulation.

Goal:
Show how the pattern holds together and why it persists.

Use clear headings.

Structure:

1. How You Operate
Describe the overall pattern directly.

2. The Repeating Cycle
Show the cycle clearly:
intention → effort → pressure → drop-off → restart.

3. Why This Pattern Exists
Explain how it protects against strain or overload.

4. Where It Breaks Down
Be direct:
- inconsistency
- restarting
- unfinished loops
- pressure dependence

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT use abstract/system-heavy language.
- Do NOT give advice.
- Do NOT reassure.

Tone:
Clinical, precise, grounded, slightly confronting.

Length:
5–8 paragraphs.

End by making clear:
the pattern makes sense, but does not change through insight alone.
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
                temperature: 0.45,
                max_tokens: 700,
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