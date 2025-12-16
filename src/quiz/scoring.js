// src/quiz/scoring.js

export const DIMENSIONS = {
    internalExternal: true,
    emotionalIntensity: true,
    structurePreference: true,
    relationalSensitivity: true
}

// Scores are summed from Likert values (-2 to +2) across questions
// Resulting range is deterministic and unipolar
export function scoreDimension(score) {
    if (score <= 9) return "low"
    if (score <= 14) return "mid"
    return "high"
}

