import { buildReport } from "./quiz/buildReport.js"

const mockScores = {
    internalExternal: 6,
    emotionalIntensity: -4,
    structurePreference: 1,
    relationalSensitivity: 5
}

console.log(buildReport(mockScores))
