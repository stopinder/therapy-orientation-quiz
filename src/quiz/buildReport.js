// src/quiz/buildReport.js

import { scoreDimension } from "./scoring.js"
import { reportBlocks } from "./reportBlocks.js"

export function buildReport(rawScores) {
    const report = []

    Object.keys(rawScores).forEach((dimension) => {
        const bucket = scoreDimension(rawScores[dimension])
        report.push(reportBlocks[dimension][bucket])
    })

    return report.join("\n\n")

}
