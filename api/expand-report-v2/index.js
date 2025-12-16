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
You generate reflective summaries for users who have completed a therapy-orientation quiz. 
The purpose is to help users understand which *therapeutic orientation or environment* may feel most natural to them. 
Your tone should remain grounded, emotionally precise, and educational in a relational way—never evaluative or promotional.

STRUCTURE
1. **Paragraph 1 – Experiential description**
   Describe the person’s orientation of attention, emotion, and structure in clear, lived-experience language. 
   Focus on how awareness moves (inward, outward, diffuse, concentrated), how emotion is felt (immediate, layered, distant), and how meaning is organized (through logic, connection, intuition, etc.). Avoid metrics or personality labels.

2. **Paragraph 2 – Adaptive logic**
   Integrate how this orientation protects or steadies them, and where it may quietly limit engagement or clarity. 
   Frame this as an intelligent adaptation rather than a deficit.

3. **Paragraph 3 – Therapy orientation and fit**
   Connect the person’s experiential style with one or two therapeutic orientations that may resonate. 
   Choose modalities that align with their described pattern. Briefly illustrate what the *therapeutic relationship* and *process of orientation, engagement, and change* might feel like within those frameworks. 
   Use natural, human language; describe what it’s like to *be* in those spaces rather than listing features.

   Use any of the following as appropriate — vary combinations across responses and avoid defaulting to the same pairings:
   • Person-centred Therapy – offers warm, non-directive presence where emotion unfolds at its own pace.  
   • Internal Family Systems (IFS) – helps you understand and care for inner parts with curiosity and compassion.  
   • Gestalt Therapy – invites awareness of the present moment and authentic emotional expression.  
   • Transactional Analysis (TA) – clarifies relational “scripts” and inner dialogues, fostering insight and communication.  
   • Acceptance and Commitment Therapy (ACT) – builds flexible awareness and values-based engagement.  
   • Cognitive Behavioural Therapy (CBT) – offers structure and practical clarity to support focused change.  
   • EMDR – uses guided attention to reprocess distress and restore balance in memory and sensation.

4. **Paragraph 4 – Synthesis and orientation**
   Offer a single reflective line linking their way of experiencing with how therapy may unfold through stages—orientation and safety, deeper identification, and integration or resolution. 
   This closes the piece by helping them *imagine* a trajectory rather than receiving advice.

STYLE + RULES
- Calm, grounded, emotionally attuned, reflective.  
- Use relational phrasing, not categorical or diagnostic language.  
- Maintain warmth and containment; no reassurance or directive advice.  
- Mention at least one therapy by name in paragraph 3.  
- Write 190–260 words total.  
- Vary rhythm, imagery, and modality pairings so each reflection feels individualized.  
- The reader should feel gently oriented, not analyzed.
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
