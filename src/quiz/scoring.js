// src/quiz/scoring.js

export const DIMENSIONS = {
    internalExternal: { min: -10, max: 10 },
    emotionalIntensity: { min: -10, max: 10 },
    structurePreference: { min: -10, max: 10 },
    relationalSensitivity: { min: -10, max: 10 }
}

export function scoreDimension(scores) {
    if (scores >= 4) return "leanA"
    if (scores <= -4) return "leanB"
    return "mixed"
}
