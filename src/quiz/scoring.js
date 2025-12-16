// src/quiz/scoring.js

export const DIMENSIONS = {
    internalExternal: true,
    emotionalIntensity: true,
    structurePreference: true,
    relationalSensitivity: true
}

// Each dimension: 5 questions × (-2 to +2) = range -10 → +10
export function scoreDimension(score) {
    if (score <= -3) return "low"
    if (score >= 3) return "high"
    return "mid"
}


