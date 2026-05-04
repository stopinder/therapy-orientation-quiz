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
- Use "you" only.
- No explanation.
- No interpretation.
- No soft qualifiers ("may", "tends to", "often").
- No abstract language.
- No metaphors.
- No clinical labels.
- No reassurance.

Critical rules:
- Do NOT repeat the same mechanism in different wording
- Each paragraph must introduce a new step in the sequence
- Remove any sentence that explains the pattern instead of showing it

Write 4–6 short paragraphs.

Structure must follow this order:
1. Start → momentum drops
2. Pressure → restart
3. Effort → does not carry forward
4. Disengagement → relief → cost
5. Intention vs behaviour
6. Loop closes

Tone:
- Direct
- Behavioural
- Slightly confronting

Final line must be:
"This pattern repeats."

Do not add anything after that line.
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