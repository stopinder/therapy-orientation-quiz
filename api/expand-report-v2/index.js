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
Describe behaviour exactly as it happens.

Hard rules:
- Use "you" directly.
- Do not diagnose or label.
- Do not use clinical labels.
- Do not use soft qualifiers such as "may", "tends to", or "often".
- Do not use abstract language.
- Do not use metaphors.
- Do not explain the pattern.
- Do not reassure.
- Avoid repeating the same pattern in different words.
- Compress the reflection to essential behaviour only.

Write 4–6 short paragraphs.

Each paragraph must:
- show a sequence: what happens, then what follows
- show where the behaviour breaks
- introduce a new layer or tighten the loop
- stay concrete

Required elements:
- starting with intention but not sustaining
- momentum dropping without a clear break
- pressure restarting behaviour
- effort not carrying forward
- restarting instead of continuing
- disengagement reducing strain but breaking flow

Required contradictions:
- you intend to continue, but do not sustain
- pressure starts action, but breaks consistency
- effort is present, but progress is unstable

Tone:
- Direct
- Behavioural
- Slightly confronting
`,

        functioning: `
You are generating a DAILY FUNCTIONING reflection.

Goal:
Show what breaks in real situations.

Hard rules:
- Use "you" directly.
- Do not diagnose or label.
- Do not explain.
- Do not soften.
- Do not give advice.
- Avoid repeating the same pattern in different words.

Write 4–6 short paragraphs.

Each paragraph must:
- show behaviour during real tasks
- show where effort fails to hold
- introduce a new layer or tighten the loop

Focus on:
- restarting
- fragmented work
- effort not accumulating
- inconsistency
- hidden compensation
- decision fatigue

Include contradictions:
- you work, but feel behind
- you compensate, but it costs energy
- you can perform under pressure, but cannot rely on pressure

Tone:
- Direct
- Grounded
- Slightly exposing
`,

        patterns: `
You are generating a PATTERNS reflection.

Goal:
Show contradictions clearly.

Rules:
- Use "you" directly.
- Do not diagnose or label.
- Do not explain.
- Do not resolve.
- Do not give advice.
- Avoid repeating the same pattern in different words.

Write 4–6 short paragraphs.

Each paragraph must:
- show one contradiction in action
- introduce a new layer or tighten the loop
- stay concrete

Focus on:
- pressure helps but destabilises
- avoidance reduces strain but creates backlog
- intensity produces output but breaks consistency
- relief in the moment creates cost later

Tone:
- Direct
- Clear
- Slightly confronting
`,

        deep: `
You are generating a DEEP formulation.

Goal:
Show the repeating loop clearly and personally.

Use these headings:

1. How You Operate
2. The Cycle
3. Why It Continues
4. Where It Breaks

Rules:
- Use "you" directly.
- Do not diagnose or label.
- Do not use abstraction.
- Do not give advice.
- Do not reassure.
- Do not over-explain.
- Avoid repeating the same pattern in different words.
- Each section must introduce a new layer or tighten the loop.

Required cycle:
intention → effort → pressure → drop-off → restart

Required tensions:
- you intend to continue, but the behaviour resets
- pressure gets you moving, but prevents consistency
- disengagement reduces strain, but breaks continuity

Tone:
- Direct
- Behaviour-based
- Slightly confronting

End by stating clearly:
This pattern repeats.

Do not explain the ending.
Do not resolve the ending.
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
                temperature: 0.35,
                max_tokens: 650,
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
    } catch {
        return res.status(500).json({ error: "Server error" });
    }
}