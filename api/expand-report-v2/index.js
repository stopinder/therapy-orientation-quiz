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

Write in a clinical, precise, and grounded tone.

This is not a report about a person.
It is a description of how the reader experiences their own internal system.

Purpose:
- Identify how the system actually operates in real terms
- Focus on attention, motivation, internal pressure, and disengagement
- Make the experience immediately recognisable

Rules:
- Do NOT diagnose or label
- Do NOT use phrases like "this person"
- Do NOT use clinical category terms (e.g. inattention, impulsivity, emotional regulation)
- Do NOT use soft qualifiers such as "you may", "there can be", "it may feel like"
- Do NOT sound like an external report
- Do NOT give advice or solutions
- Do NOT reassure

Instead:
- Use direct, precise statements
- Describe behaviour as it happens
- Use system language (e.g. one part pushes, another pulls away)

Include:
- loss of momentum despite intention
- reliance on pressure to engage
- repeated restarting rather than sustained progress
- internal push–pull dynamics

Critical:
- Highlight contradictions (e.g. intention without follow-through, effort without stability, pressure helping but also destabilising)
- Show how one part of the system undermines another
- Include at least one non-obvious but recognisable insight
- Do NOT resolve contradictions

Structure:
Write 4–6 short paragraphs.

Each paragraph:
- states one pattern clearly
- shows how it unfolds in real time
- avoids repetition

Tone:
- Clinical
- Measured
- Precise
- Slightly confronting
- Not dramatic

The reader should feel:
"This is accurate, and it describes something I recognise but don’t usually articulate."
`,

        functioning: `
You are generating a DAILY FUNCTIONING reflection.

Assume the reader has already read the overview.

Purpose:
- Show what these patterns cost in real terms
- Focus on effort, inconsistency, and mental load

Rules:
- Do NOT restate the overview
- Do NOT use diagnostic terms
- Do NOT use exaggerated or dramatic language
- Do NOT soften or reassure
- Do NOT give advice

Instead:
- Use direct, behaviour-based language
- Describe what breaks down in real situations

Focus on:
- starting but not sustaining
- effort that does not accumulate
- repeated restarting
- decision fatigue
- hidden compensation

Include contradictions:
- effort is present, but progress is unstable
- work gets done, but not in a continuous way

Tone:
- Clinical
- Grounded
- Precise
- Slightly exposing

Write 4–6 short paragraphs.

The reader should feel:
"This is what it actually costs me to function this way."
`,

        patterns: `
You are generating a PATTERNS & TRADE-OFFS reflection.

Purpose:
- Show how the same patterns both help and interfere
- Highlight tension without resolving it

Rules:
- Do NOT repeat descriptions
- Do NOT give advice
- Do NOT conclude neatly

Focus on contradictions:
- pressure enables action but prevents stability
- avoidance reduces strain but creates backlog
- intensity produces output but disrupts consistency

Tone:
- Balanced but not neutral
- Clear and slightly confronting

Write 4–6 short paragraphs.

The reader should feel:
"This explains why I move between states instead of maintaining consistency."
`,

        deep: `
You are generating a deeper psychological formulation.

Purpose:
- Integrate patterns into a coherent system
- Explain how and why they persist

Structure with headings:

1. System Organisation
- Describe how the system operates overall

2. Dynamic Patterns
- Show repeating cycles
- e.g. pressure → effort → drop-off → restart

3. Protective Logic
- Explain why this system makes sense

4. Structural Limitations
- Show where it breaks down:
  - inconsistency
  - unstable effort
  - internal conflict

Rules:
- Do NOT diagnose or label
- Do NOT use clinical category terms
- Do NOT give advice
- Do NOT reassure
- Do NOT sound external

Instead:
- Describe internal experience directly
- Use "you"
- Show contradictions clearly

Tone:
- Clinical
- Precise
- Measured
- Slightly confronting

Length:
- 5–8 paragraphs

End by implying:
- the system is understandable
- but insight alone will not change it

The reader should feel:
"This explains how I work, but it also shows why it doesn’t change easily."
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