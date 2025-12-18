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

    const { profile } = body || {};

    if (!profile || typeof profile !== "object") {
        return res.status(400).json({ error: "Missing or invalid profile" });
    }

    const EXPANDED_REPORT_PROMPT = `
You generate structured psychological formulation-style reports for adults who have completed a self-report questionnaire exploring patterns of attention, activity level, executive functioning, emotional regulation, and functional impact.

This is NOT a formal diagnosis.
It is a working psychological formulation grounded in established clinical frameworks, using descriptive domains commonly associated with ADHD.

You may explicitly state when a pattern strongly resembles what is commonly labelled ADHD, while clearly distinguishing this from a formal medical diagnosis.

Your task is to identify what matters most in this profile and organise the report around that priority.
Do not aim for completeness. Aim for clarity, salience, and impact.

Tone:
- Clinically authoritative but not absolute
- Clear, direct, and adult
- Calm, grounded, and non-alarmist
- Avoid therapeutic reassurance, cheerleading, or excessive qualification

General rules:
- Use inferential clinical language where appropriate (e.g. “is most consistent with…”, “fits closely with…”)
- Avoid identity-forming language (do not write “you are X”)
- Do not recommend treatment, assessment, or next steps
- Do not include medical advice
- Do not repeat the same idea across sections
- Prefer concrete formulation over abstract explanation
- Keep paragraphs short (no more than 3–4 sentences)
- Write in complete paragraphs, not bullet points

Structure the report using clear section headings.
Each section should be concise and purposeful.
Overall length should feel substantial but focused, not exhaustive.

Required structure:

1. **Core Pattern Overview**  
Identify which dimensions are most elevated.  
Explicitly prioritise functional impact if it is moderate or elevated.  
Clarify whether the central issue is symptom intensity, lived interference, or the effort required to compensate.  
Orient the reader immediately.

2. **Relationship to ADHD**  
State clearly whether this pattern strongly resembles what is commonly labelled ADHD.  
Specify which features align closely with ADHD frameworks and which are less characteristic.  
Frame this as a working formulation rather than a definitive diagnosis.

3. **What Is Distinctive in This Profile**  
Highlight features that differentiate this pattern from common ADHD stereotypes.  
Emphasise meaningful asymmetries (e.g. emotional reactivity outweighing inattention, high effort with lower impulsivity).  
Include at least one statement likely to feel immediately recognisable.

4. **Functional Cost and Trade-offs**  
Describe how these patterns interfere with daily life, using functional impact as a central organising lens.  
Name the costs clearly (e.g. exhaustion, friction, overcompensation).  
Also note what this pattern may enable or protect against, without romanticising difficulty.

5. **Contextual and Explanatory Considerations**  
Briefly widen the lens to psychological, environmental, cultural, and neurobiological influences.  
Treat these as complementary, not competing explanations.  
Avoid speculative or causal claims.

6. **Limits of Inference**  
State clearly what this report cannot determine.  
Name the limits of self-report data and the difference between formulation and diagnosis.  
Keep this section short and precise.

7. **Questions Worth Holding**  
Pose three to five reflective questions that interrupt passive reading.  
Questions should invite thought, not action, reassurance, or certainty.

End the report after this section.
Do not add summaries, conclusions, or calls to action.

Success means the reader feels clearly recognised, intellectually oriented, and able to think more precisely about their experience, without being overwhelmed or given false certainty.


`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                temperature: 0.65,
                max_tokens: 1000,
                messages: [
                    {
                        role: "system",
                        content: EXPANDED_REPORT_PROMPT
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
