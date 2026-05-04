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
Describe what actually happens in behaviour, step by step.

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT use clinical category terms.
- Do NOT use soft qualifiers ("may", "might", "tends to").
- Do NOT use metaphors or abstract/system language.
- Do NOT explain the pattern.
- Do NOT give advice or reassurance.

Write 4–6 short paragraphs.

Each paragraph must:
- show a sequence (what happens → what follows)
- include where momentum breaks
- avoid interpretation

Focus on:
- starting with intention but not sustaining
- momentum dropping without a clear break
- reliance on pressure to engage
- effort not carrying forward
- restarting instead of continuing
- disengagement reducing strain but breaking continuity

Include contradictions:
- you intend to continue, but do not sustain
- pressure gets you moving, but breaks consistency
- effort is present, but progress is unstable

Tone:
- Direct
- Behaviour-based
- Clinical
- Slightly confronting

The reader should recognise their behaviour immediately.
`,

        functioning: `
You are generating a DAILY FUNCTIONING reflection.

Goal:
Show what this costs in real situations.

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT use dramatic language.
- Do NOT explain or soften.
- Do NOT give advice.

Write 4–6 short paragraphs.

Each paragraph must:
- show what happens during tasks
- show where effort breaks
- avoid interpretation

Focus on:
- repeated restarting
- work happening in fragments
- effort not carrying forward
- decision fatigue
- hidden compensation
- inconsistency across days

Include contradictions:
- you work, but feel behind
- you compensate, but it costs energy
- you can perform under pressure, but cannot rely on it

Tone:
- Direct
- Grounded
- Slightly exposing
`,

        patterns: `
You are generating a PATTERNS & TRADE-OFFS reflection.

Goal:
Show the contradictions clearly.

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT explain or resolve.
- Do NOT give advice.

Write 4–6 short paragraphs.

Each paragraph must:
- show a contradiction in action
- avoid interpretation

Focus on:
- pressure enabling action but breaking stability
- avoidance reducing strain but creating backlog
- intensity producing output but disrupting consistency
- relief in the moment creating cost later

Tone:
- Direct
- Clear
- Slightly confronting
`,

        deep: `
You are generating a deeper psychological formulation.

Goal:
Show how the pattern repeats and why it does not stabilise.

Use clear headings.

Structure:

1. How You Operate
Describe the pattern directly in behaviour.

2. The Cycle
Show the loop clearly:
intention → effort → pressure → drop-off → restart.

3. Why It Continues
Show how the pattern reduces strain in the moment.

4. Where It Breaks
State clearly:
- inconsistency
- restarting
- unfinished tasks
- reliance on pressure

Rules:
- Use "you" directly.
- Do NOT diagnose or label.
- Do NOT use abstract/system language.
- Do NOT explain excessively.
- Do NOT give advice or reassurance.

Tone:
- Clinical
- Direct
- Behaviour-based
- Slightly confronting

Length:
5–8 paragraphs.

End by making clear:
the pattern repeats because it reduces strain, but does not stabilise.
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
                temperature: 0.4,
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