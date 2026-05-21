export function calculateSignalDensity(
    totalSignalStrength = 0
) {

    if (totalSignalStrength < 45) {
        return "very_low"
    }

    if (totalSignalStrength < 110) {
        return "low"
    }

    if (totalSignalStrength < 220) {
        return "moderate"
    }

    return "high"

}

export function calculateResponseIntensity(
    responseDistribution = {}
) {

    const {
        never = 0,
        rarely = 0,
        sometimes = 0,
        often = 0,
        veryOften = 0
    } = responseDistribution

    const highFrequency =
        often + veryOften

    if (never >= 20) {
        return "minimal"
    }

    if (
        rarely >= 14 &&
        highFrequency <= 3
    ) {
        return "light"
    }

    if (
        sometimes >= 10 &&
        highFrequency <= 8
    ) {
        return "mixed"
    }

    if (highFrequency >= 12) {
        return "strong"
    }

    return "variable"

}

export function calculateContinuitySeverity(
    behaviouralSummary = {}
) {

    const continuity =
        behaviouralSummary.continuityInstability || 0

    if (continuity < 45) {
        return "minimal"
    }

    if (continuity < 90) {
        return "moderate"
    }

    return "high"

}