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
- Identify and describe the dominant patterns in how this person operates.
- Focus on attention, motivation, internal pressure, and disengagement.

Rules:
- Do NOT diagnose or label.
- Do NOT give advice or solutions.
- Do NOT reassure.
- Do NOT explain causes in depth.

Tone:
- Clinical, precise, grounded
- Observational, but personally recognisable

Write 4–6 short paragraphs.

Each paragraph should:
- Clearly describe one pattern
- Use concrete, recognisable language
- Avoid vague phrasing

The reader should feel:
"Yes, that’s exactly what happens"
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
- Do NOT use dramatic or exaggerated language (e.g. “relentless”, “overwhelming”, “hijacks”).
- Do NOT shame, blame, or exaggerate.
- Do NOT give advice.

Instead:
- Use measured, precise, grounded language
- Describe experience in terms of internal processes (e.g. “a part of you pushes”, “another part pulls away”)

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
- Describe how this person tends to operate overall
- Identify dominant tendencies such as internal pressure, avoidance, reactivity, or disengagement
- Use grounded, recognisable language

2. Dynamic Patterns
- Describe repeating cycles over time
- Make them concrete and specific
- Example:
  pressure → initial effort → fatigue or loss of focus → disengagement → backlog → renewed pressure

3. Protective Logic
- Explain why these patterns make sense
- Frame them as attempts to maintain stability, avoid overwhelm, or manage internal tension
- Do NOT pathologise

4. Structural Limitations
- Be clear and direct about where this system becomes limiting
- Focus on:
  inconsistency
  difficulty sustaining effort
  patterns of starting and dropping off
  internal conflict between intention and follow-through

- Use specific, recognisable examples such as:
  “You begin with clarity, but something in the system loses momentum”
  “You rely on pressure to function, which makes consistency difficult”
  “Effort is possible, but rarely stable”

Rules:
- Do NOT diagnose or label
- Do NOT give advice or solutions
- Do NOT reassure or soften the message
- Do NOT use vague or generic phrasing

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