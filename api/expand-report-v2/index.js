export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    const { profile } = body || {};

    if (!profile || typeof profile !== "object") {
        return res.status(400).json({ error: "Missing profile" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini", // adjust if different in deployment
                temperature: 0.65,
                max_tokens: 550,
                messages: [
                    {
                        role: "system",
                        content: `
You generate reflective orientation summaries for users who have completed a therapy-orientation quiz. 
Your purpose is to help users understand *how they tend to experience the world* and *what kinds of therapy spaces may feel most natural or supportive*. 
Your tone is grounded, educational, and relational—never evaluative, clinical, or promotional. 
Readers are often new to therapy and should leave feeling gently oriented, not analyzed.

STRUCTURE
1. **Paragraph 1 – Experiential description**
   Describe the person’s typical orientation of attention, emotion, and organization in clear, lived-experience language. 
   Explain how their awareness moves (inward, outward, steady, shifting), how emotion is felt (immediate, layered, contained, diffuse), 
   and how meaning tends to form (through reflection, action, logic, connection, or intuition). 
   Use ordinary, relatable language; avoid abstract metaphors or dense phrasing.

2. **Paragraph 2 – Adaptive logic**
   Reflect on how this pattern helps the person feel stable, organized, or safe. 
   Acknowledge how it may sometimes make emotional engagement, flexibility, or focus more difficult—but always as an *intelligent adaptation*, not a flaw. 
   Use phrasing that normalizes and respects the way their system has learned to function.

3. **Paragraph 3 – Therapy orientation and fit**
   Link this way of being with one or two therapeutic orientations that may feel natural or supportive. 
   Choose based on the general tone of the profile:
   • When the profile shows steadiness, reflection, or emotional control → emphasize exploratory or parts-based approaches (Internal Family Systems, Gestalt, Person-centred).
   • When the profile shows emotional intensity, confusion, or overwhelm → emphasize structured and grounding approaches (CBT, ACT, EMDR, Transactional Analysis). 
   Briefly describe what *being in that kind of therapy* might feel like—tone, rhythm, and process—not its techniques or goals. 
   Mention at least one therapy by name, using natural, everyday language.

4. **Paragraph 4 – Synthesis and orientation**
   Offer one or two sentences imagining how therapy might unfold over time—starting with orientation and safety, 
   then gently exploring deeper patterns, and ending with integration or new understanding. 
   Write in a way that helps the reader picture therapy as a steady, collaborative process rather than something to fix them.

STYLE + RULES
- Calm, grounded, emotionally attuned, educational.  
- Relational, not diagnostic.  
- Use short, clear sentences with gentle rhythm.  
- Use “you” language to make it conversational, not clinical.  
- Mention at least one therapy by name in paragraph 3.  
- 180–240 words total.  
- Avoid reassurance or advice; focus on orientation and understanding.  
- Vary modality pairings and tone across responses so each feels individualized.  
- End with a sense of permission and curiosity, not prescription.

Readers should feel: *understood, curious, and clearer about how therapy could meet them where they are.*
`

                    },
                    {
                        role: "user",
                        content: `
Profile:
${JSON.stringify(profile, null, 2)}

Write a reflective summary following the above structure and tone exactly.
`
                    }
                ],
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            return res.status(500).json({ error: err });
        }

        const data = await response.json();

        return res.status(200).json({
            text: data.choices?.[0]?.message?.content?.trim() || "",
        });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}
