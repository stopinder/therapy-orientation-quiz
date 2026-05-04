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
Write something clinically grounded, personally recognisable, and slightly uncomfortable.
It should sound like a careful clinician describing the reader's lived experience, not like an academic paper.

Rules:
- Use "you" directly.
- Do NOT use phrases like "the system", "internal regulatory framework", "this person", or "the individual".
- Do NOT diagnose or label.
- Do NOT use clinical category terms.
- Do NOT give advice or solutions.
- Do NOT reassure.
- Do NOT use poetic or abstract language.
- Do NOT overuse "may", "might", or "can".

Write 4–6 short paragraphs.

Focus on:
- what the reader starts doing
- where momentum drops
- how pressure helps and also disrupts
- how effort is real but does not always accumulate
- how disengagement can function as relief
- how intention and follow-through do not fully line up

Include clear contradictions:
- You intend to continue, but momentum drops.
- Pressure gets you moving, but makes consistency unstable.
- Effort is present, but progress does not reliably build.
- Disengagement protects you, but interrupts continuity.

Style:
- Direct
- Specific
- Behaviour-based
- Measured
- Slightly confronting, not harsh

The reader should feel:
"This is describing something I actually do."
`,

        functioning: `
You are generating a DAILY FUNCTIONING reflection.

Goal:
Describe what this costs in everyday life.

Rules:
- Use "you" directly.
- Do NOT sound academic.
- Do NOT diagnose or label.
- Do NOT use dramatic language.
- Do NOT give advice.
- Do NOT reassure.

Write 4–6 short paragraphs.

Focus on:
- repeated restarting
- work getting done in fragments
- hidden effort
- decision fatigue
- unreliable consistency
- the gap between intention and actual follow-through

Include contradictions:
- You work hard, but still feel behind.
- You compensate, but the compensation costs energy.
- You can perform under pressure, but cannot depend on pressure as a stable method.

Tone:
Clinical, grounded, direct, personally recognisable.
`,

        patterns: `
You are generating a PATTERNS & TRADE-OFFS reflection.

Goal:
Show the internal contradictions clearly without resolving them.

Rules:
- Use "you" directly.
- Do NOT sound academic.
- Do NOT diagnose or label.
- Do NOT give advice.
- Do NOT conclude neatly.

Write 4–6 short paragraphs.

Focus on:
- pressure creating action but reducing stability
- avoidance reducing strain but creating backlog
- intensity producing output but disrupting consistency
- relief in the short term creating cost later

Tone:
Balanced, direct, slightly confronting.
`,

        deep: `
You are generating a deeper psychological formulation.

Goal:
Make the reader feel accurately seen, not clinically analysed from a distance.

Use clear headings.

Sections:

1. How This Pattern Organises Itself
Describe the main operating pattern in direct language.

2. The Repeating Cycle
Show the cycle clearly:
intention → effort → pressure → drop-off → restart.

3. Why It Makes Sense
Explain how the pattern protects the reader from strain, pressure, or overload.

4. Where It Keeps You Stuck
Name the cost directly:
inconsistency, restarting, unfinished loops, pressure-dependence, and reduced trust in follow-through.

Rules:
- Use "you" directly.
- Do NOT say "the system" repeatedly.
- Do NOT sound academic.
- Do NOT diagnose or label.
- Do NOT give advice.
- Do NOT reassure.
- Do NOT over-explain.

Tone:
Clinical, measured, direct, personal, slightly uncomfortable.

Length:
5–8 paragraphs.

End by making clear:
this pattern makes sense, but insight alone is unlikely to change it.
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
                temperature: 0.5,
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