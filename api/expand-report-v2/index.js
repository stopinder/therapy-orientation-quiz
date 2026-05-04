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
- Identify and describe the dominant patterns in how the system operates
- Focus on attention, motivation, internal pressure, and disengagement
- Make the experience immediately recognisable

Rules:
- Do NOT diagnose or label
- Do NOT use phrases like "this person"
- Do NOT use clinical category terms (e.g. inattention, impulsivity, emotional regulation)
- Do NOT sound like an external report
- Do NOT give advice or solutions
- Do NOT reassure or soften unnecessarily

Instead:
- Write directly in terms of experience ("you may notice...", "there can be a sense that...")
- Describe internal dynamics (e.g. one part pushes, another pulls away)
- Use concrete, lived language rather than abstract phrasing

Structure:
Write 4–6 short paragraphs.

Each paragraph should:
- Describe one clear pattern
- Include how it unfolds in real time
- Avoid repetition

Include elements such as:
- starting with intention but losing momentum
- needing pressure or urgency to engage
- attention drifting despite effort
- internal tension between pushing and avoiding
- cycles of effort followed by drop-off

Tone:
- Clinical
- Measured
- Observational
- Personally recognisable
- Slightly exposing, but not dramatic

The reader should feel:
"This is describing how I actually operate, not just summarising traits."
`,

        functioning: `
You are generating a DAILY FUNCTIONING reflection.

Assume the reader has already read the overview.

Purpose:
- Describe the cost of these patterns in real life.
- Focus on effort, friction, inconsistency, and mental load.

Rules:
- Do NOT restate the overview.
- Do NOT use diagnostic terms (e.g. inattention, impulsivity, hyperactivity).
- Do NOT use dramatic or exaggerated language (e.g. "relentless", "overwhelming", "hijacks").
- Do NOT shame, blame, or exaggerate.
- Do NOT give advice.

Instead:
- Use measured, precise, grounded language
- Describe experience in terms of internal processes (e.g. "a part of you pushes", "another part pulls away")

Focus on:
- difficulty starting tasks
- difficulty sustaining effort
- internal push–pull dynamics
- repeated restarting and loss of momentum
- hidden effort and compensation

Tone:
- Clinical
- Measured
- Observational
- Slightly exposing, but not harsh

Write 4–6 short paragraphs.

The reader should feel:
"This describes what it’s actually like, without exaggerating it."
`,

        patterns: `
You are generating a PATTERNS & TRADE-OFFS reflection.

Assume the reader understands both patterns and functioning impact.

Purpose:
- Show how these patterns both help and hinder.
- Highlight internal tensions and longer-term trade-offs.

Rules:
- Do NOT repeat earlier descriptions.
- Do NOT resolve the tension.
- Do NOT give advice.
- Do NOT conclude neatly.

Focus on:
- how pressure increases output but reduces sustainability
- how avoidance protects but creates backlog
- how intensity helps in short bursts but destabilises consistency

Tone:
- Balanced but not neutral
- Reflective, slightly confronting

Write 4–6 short paragraphs.

The reader should feel:
"This explains why you move between different states rather than staying consistent."
`,

        deep: `
You are generating a deeper psychological formulation of a person’s internal system.

Assume the reader has already seen:
- an overview of their patterns
- the impact on daily functioning
- the trade-offs involved

Purpose:
- Integrate these into a coherent system
- Describe how different processes interact over time
- Show why these patterns persist

Structure the response into 4 sections (use clear headings):

1. System Organisation
- Describe how the system tends to operate overall
- Identify dominant tendencies such as internal pressure, avoidance, reactivity, or disengagement

2. Dynamic Patterns
- Describe repeating cycles over time
- Example:
  pressure → effort → fatigue or loss of focus → disengagement → backlog → renewed pressure

3. Protective Logic
- Explain why these patterns make sense
- Frame them as attempts to maintain stability, avoid overwhelm, or manage internal tension

4. Structural Limitations
- Be clear and direct about where this system becomes limiting
- Focus on:
  inconsistency
  difficulty sustaining effort
  patterns of starting and dropping off
  internal conflict between intention and follow-through

Rules:
- Do NOT diagnose or label
- Do NOT use clinical category terms
- Do NOT give advice or solutions
- Do NOT reassure
- Do NOT sound like an external report

Instead:
- Write as if describing the reader’s internal experience directly
- Use "you" where appropriate
- Focus on how it feels from inside the system

Tone:
- Clinical
- Measured
- Precise
- Slightly confronting but not harsh

Length:
- 5–8 paragraphs total

End with a short closing paragraph that implies:
- this system is understandable
- but unlikely to change through insight alone

The reader should feel:
"This is accurate, and it explains something I recognise but haven’t been able to articulate."
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