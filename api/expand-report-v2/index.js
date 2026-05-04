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

Write 4–6 short paragraphs.

Each paragraph must:
- show a sequence (what happens → what follows)
- show where it breaks
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
- Use "you".
- No explanation.
- No softening.
- No diagnosis.
- No advice.

Write 4–6 short paragraphs.

Each paragraph must:
- show behaviour during tasks
- show where effort fails to hold

Focus on:
- restarting
- fragmented work
- effort not accumulating
- inconsistency

Include contradictions:
- you work, but feel behind
- you compensate, but it costs energy
`,

        patterns: `
You are generating a PATTERNS reflection.

Goal:
Show contradictions only.

Rules:
- Use "you".
- No explanation.
- No resolution.
- No advice.

Write 4–6 short paragraphs.

Focus on:
- pressure helps but destabilises
- avoidance reduces strain but creates backlog
- intensity produces output but breaks consistency

Tone:
- Direct
- Clear
- Slightly confronting
`,

        deep: `
You are generating a DEEP formulation.

Goal:
Show the repeating loop clearly.

Structure:

1. How You Operate
2. The Cycle (intention → effort → drop-off → restart)
3. Why It Continues (reduces strain)
4. Where It Breaks (inconsistency, restarting)

Rules:
- Use "you"
- No abstraction
- No diagnosis
- No advice
- No reassurance

Tone:
- Direct
- Behaviour-based
- Slightly confronting

End:
The pattern repeats because it reduces strain, but does not stabilise.
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