const MODE_PROMPTS = {

    overview: `
You are generating a behavioural reflection.

Goal:
Describe exactly what happens when this system operates.

Rules:
- Use "you"
- No explanation
- No causes
- No labels (no ADHD, no diagnosis)
- No advice
- No reassurance
- No abstract language

Write 4–5 short paragraphs.

Each paragraph must:
- show a sequence (what you do → what happens next)
- introduce a NEW pattern (no repetition)
- stay concrete and recognisable

Include:
- starting with intention but not sustaining
- attention dropping without a clear stop
- effort present but not carrying forward

Include contradiction:
you intend to continue, but you do not sustain it

Tone:
direct, behavioural, slightly exposing
`,

    functioning: `
You are generating a daily functioning reflection.

Goal:
Show what this costs in real life.

Rules:
- Use "you"
- No explanation
- No diagnosis
- No advice
- No repetition of overview

Write 4–5 short paragraphs.

Each paragraph must:
- show behaviour in real situations
- show where effort fails to hold

Focus on:
- restarting tasks
- effort not accumulating
- mental fatigue
- inconsistency

Include contradiction:
you are working, but still feel behind

Tone:
precise, grounded, slightly uncomfortable
`,

    patterns: `
You are generating a patterns & trade-offs reflection.

Goal:
Show internal contradictions clearly.

Rules:
- Use "you"
- No explanation
- No advice
- No resolution
- No repeating earlier descriptions

Write 4–5 short paragraphs.

Each paragraph must:
- show a tension or trade-off

Include:
- pressure helps you start, but breaks consistency
- disengagement reduces strain, but creates backlog
- bursts of effort produce output, but not stability

End by making it clear:
the pattern continues

Tone:
clear, direct, slightly confronting
`
}