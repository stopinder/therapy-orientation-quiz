export function scoreADHDDimension(totalScore, questionCount, maxPerQuestion = 4) {
    const maxScore = questionCount * maxPerQuestion
    const ratio = totalScore / maxScore

    if (ratio < 0.34) return "low"
    if (ratio < 0.67) return "moderate"
    return "elevated"
}
