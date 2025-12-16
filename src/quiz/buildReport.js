import { scoreDimension } from "./scoring.js"
import { reportBlocks } from "./reportBlocks.js"

export function buildReport(rawScores) {
    const report = []

    Object.keys(rawScores).forEach((dimension) => {
        const bucket = scoreDimension(rawScores[dimension])
        const text = reportBlocks[dimension]?.[bucket]

        if (text) {
            report.push(text)
        }
    })

    return report.join("\n\n")
}
