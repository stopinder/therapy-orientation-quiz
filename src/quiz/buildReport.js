import { scoreDimension } from "./scoring.js"
import { reportBlocks } from "./reportBlocks.js"

export function buildReport(rawScores) {
    const report = []

    Object.keys(reportBlocks).forEach((dimension) => {
        const score = rawScores[dimension]
        if (typeof score !== "number") return

        const bucket = scoreDimension(score)
        const text = reportBlocks[dimension][bucket]

        if (text) {
            report.push(text)
        }
    })

    return report.join("\n\n")
}
