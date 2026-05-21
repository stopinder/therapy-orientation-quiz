import { TRAIT_WEIGHTS } from "./traitMap.js"
import { adhdQuestions } from "./questions.js"

const RESPONSE_WEIGHTS = {
    0: 0,
    1: 1,
    2: 3,
    3: 6,
    4: 10
}

function createEmptyTraits() {

    return {

        activationFriction: 0,
        attentionalCapture: 0,
        avoidancePressure: 0,
        backlogPressure: 0,
        behaviouralAcceleration: 0,
        compensatoryPreparation: 0,
        compensatoryPressure: 0,
        completionInstability: 0,
        continuityBreakdown: 0,
        continuityInstability: 0,
        driftRecoveryFailure: 0,
        emotionalCarryover: 0,
        emotionalInterference: 0,
        emotionalResistance: 0,
        exhaustionAccumulation: 0,
        focusRecoveryFailure: 0,
        fragmentation: 0,
        impulsiveCommitment: 0,
        impulsiveRedirection: 0,
        instabilityAcceleration: 0,
        interruptionSensitivity: 0,
        internalAcceleration: 0,
        lowRecovery: 0,
        mentalLoadPersistence: 0,
        mentalOveractivity: 0,
        overloadEscalation: 0,
        partialEngagement: 0,
        pressureActivation: 0,
        pseudoProductivity: 0,
        reliefSeeking: 0,
        restartCycling: 0,
        restlessness: 0,
        selfInterruption: 0,
        stalledMomentum: 0,
        stimulationDependence: 0,
        sustainedStillnessDifficulty: 0,
        unresolvedCarryover: 0,
        urgencyDependence: 0,
        overwhelmEscalation: 0

    }

}

function getAnsweredQuestionsCount(answers) {

    return Object.keys(answers || {}).length

}

function getTotalSignalStrength(traits) {

    return Object.values(traits)
        .reduce((sum, value) => sum + value, 0)

}

function calculateAverageResponse(answers) {

    const values =
        Object.values(answers)
            .map(Number)

    if (!values.length) return 0

    const total =
        values.reduce(
            (sum, value) => sum + value,
            0
        )

    return total / values.length

}

function detectLowSignal(
    traits,
    averageResponse
) {

    const total =
        getTotalSignalStrength(traits)

    return (
        total < 125 ||
        averageResponse < 1.35
    )

}

function detectVeryLowSignal(
    traits,
    averageResponse
) {

    const total =
        getTotalSignalStrength(traits)

    return (
        total < 60 ||
        averageResponse < 0.7
    )

}

function getTopTraits(
    traits,
    limit = 8
) {

    return Object.entries(traits)
        .filter(([, value]) => value > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, value]) => ({
            name,
            value
        }))

}

function calculateDimensionTotals(
    answers
) {

    const totals = {
        inattention: 0,
        executive_function: 0,
        impulsivity: 0,
        hyperactivity: 0,
        emotional_regulation: 0,
        functional_impact: 0
    }

    Object.entries(answers)
        .forEach(([id, value]) => {

            const question =
                adhdQuestions.find(
                    q => q.id === id
                )

            if (!question) return

            if (
                totals[
                    question.dimension
                    ] === undefined
            ) {
                return
            }

            totals[
                question.dimension
                ] += Number(value)

        })

    return totals

}

function detectProfiles(
    traits,
    dimensionTotals,
    lowSignal
) {

    if (lowSignal) {
        return []
    }

    const profiles = []

    if (
        traits.urgencyDependence >= 48 &&
        traits.restartCycling >= 38 &&
        traits.exhaustionAccumulation >= 34
    ) {

        profiles.push({
            key: "pressure_sustained_functioning",
            label:
                "Pressure-sustained functioning",
            confidence: "high"
        })

    }

    if (
        traits.continuityBreakdown >= 42 &&
        traits.partialEngagement >= 30 &&
        traits.completionInstability >= 34
    ) {

        profiles.push({
            key: "fragmented_completion",
            label:
                "Fragmented completion",
            confidence: "high"
        })

    }

    if (
        traits.internalAcceleration >= 36 &&
        traits.mentalOveractivity >= 22 &&
        traits.lowRecovery >= 15
    ) {

        profiles.push({
            key:
                "internally_accelerated_functioning",
            label:
                "Internally accelerated functioning",
            confidence: "moderate"
        })

    }

    if (
        traits.restartCycling >= 42 &&
        traits.stalledMomentum >= 24
    ) {

        profiles.push({
            key:
                "restart_loop_instability",
            label:
                "Restart-loop instability",
            confidence: "high"
        })

    }

    if (
        traits.pseudoProductivity >= 30 &&
        traits.exhaustionAccumulation >= 30
    ) {

        profiles.push({
            key:
                "high_effort_stagnation",
            label:
                "High-effort stagnation",
            confidence: "moderate"
        })

    }

    if (
        traits.fragmentation >= 34 &&
        traits.attentionalCapture >= 34
    ) {

        profiles.push({
            key:
                "fragmented_attention_flow",
            label:
                "Fragmented attention flow",
            confidence: "high"
        })

    }

    if (
        dimensionTotals
            .emotional_regulation >= 8 &&
        traits.emotionalInterference >= 22
    ) {

        profiles.push({
            key:
                "emotionally_disrupted_continuity",
            label:
                "Emotionally disrupted continuity",
            confidence: "moderate"
        })

    }

    return profiles

}

function detectContradictions(
    traits,
    lowSignal
) {

    if (lowSignal) {
        return []
    }

    const contradictions = []

    if (
        traits.compensatoryPressure >= 22 &&
        traits.completionInstability >= 22
    ) {

        contradictions.push(
            "Large amounts of effort are spent trying to maintain continuity without fully stabilising it."
        )

    }

    if (
        traits.pressureActivation >= 20 &&
        traits.restartCycling >= 22
    ) {

        contradictions.push(
            "Urgency creates movement while making consistency harder to sustain afterwards."
        )

    }

    if (
        traits.partialEngagement >= 18 &&
        traits.pseudoProductivity >= 18
    ) {

        contradictions.push(
            "Activity accumulates more easily than meaningful completion."
        )

    }

    if (
        traits.internalAcceleration >= 22 &&
        traits.lowRecovery >= 12
    ) {

        contradictions.push(
            "Rest rarely feels fully restorative because mental movement continues in the background."
        )

    }

    if (
        traits.activationFriction >= 22 &&
        traits.urgencyDependence >= 18
    ) {

        contradictions.push(
            "Movement becomes easier once pressure appears, even when starting earlier felt difficult."
        )

    }

    return contradictions

}

function detectDominantPattern(
    traits,
    lowSignal
) {

    if (lowSignal) {
        return "stable_continuity"
    }

    const sorted =
        getTopTraits(traits, 1)

    return (
        sorted[0]?.name ||
        "continuityBreakdown"
    )

}

function getQuestionSignals(
    answers,
    lowSignal
) {

    if (lowSignal) {
        return []
    }

    return adhdQuestions
        .map(question => ({
            id: question.id,
            text: question.text,
            value: Number(
                answers[
                    question.id
                    ] || 0
            )
        }))
        .filter(item => item.value >= 2)
        .sort((a, b) => b.value - a.value)
        .slice(0, 12)

}

function calculateResponseDistribution(
    answers
) {

    const distribution = {
        never: 0,
        rarely: 0,
        sometimes: 0,
        often: 0,
        veryOften: 0
    }

    Object.values(answers)
        .forEach(value => {

            switch (Number(value)) {

                case 0:
                    distribution.never++
                    break

                case 1:
                    distribution.rarely++
                    break

                case 2:
                    distribution.sometimes++
                    break

                case 3:
                    distribution.often++
                    break

                case 4:
                    distribution.veryOften++
                    break

            }

        })

    return distribution

}

function detectResponseStyle(
    distribution,
    averageResponse
) {

    if (
        distribution.never >= 22 ||
        averageResponse < 0.6
    ) {

        return "minimal_endorsement"

    }

    if (
        distribution.never >= 12 &&
        distribution.often <= 2 &&
        distribution.veryOften === 0
    ) {

        return "low_frequency_recognition"

    }

    if (
        distribution.sometimes >= 10 &&
        distribution.often <= 8
    ) {

        return "mixed_inconsistency"

    }

    if (
        distribution.often +
        distribution.veryOften >= 12
    ) {

        return "high_pattern_recognition"

    }

    return "variable"

}

export function buildBehaviourProfile(
    answers = {}
) {

    const traits =
        createEmptyTraits()

    Object.entries(answers)
        .forEach(([questionId, rawValue]) => {

            const weightedValue =
                RESPONSE_WEIGHTS[
                    Number(rawValue)
                    ] || 0

            const mapping =
                TRAIT_WEIGHTS[
                    questionId
                    ]

            if (!mapping) return

            Object.entries(mapping)
                .forEach(([trait, multiplier]) => {

                    traits[trait] +=
                        weightedValue *
                        multiplier

                })

        })

    const averageResponse =
        calculateAverageResponse(
            answers
        )

    const dimensionTotals =
        calculateDimensionTotals(
            answers
        )

    const responseDistribution =
        calculateResponseDistribution(
            answers
        )

    const responseStyle =
        detectResponseStyle(
            responseDistribution,
            averageResponse
        )

    const totalSignalStrength =
        getTotalSignalStrength(
            traits
        )

    const lowSignal =
        detectLowSignal(
            traits,
            averageResponse
        )

    const veryLowSignal =
        detectVeryLowSignal(
            traits,
            averageResponse
        )

    const dominantPattern =
        detectDominantPattern(
            traits,
            lowSignal
        )

    const profiles =
        detectProfiles(
            traits,
            dimensionTotals,
            lowSignal
        )

    const contradictions =
        detectContradictions(
            traits,
            lowSignal
        )

    const topTraits =
        getTopTraits(
            traits
        )

    const answeredQuestions =
        getAnsweredQuestionsCount(
            answers
        )

    const strongestQuestionSignals =
        getQuestionSignals(
            answers,
            lowSignal
        )

    return {

        answeredQuestions,

        averageResponse,

        responseStyle,

        responseDistribution,

        totalSignalStrength,

        lowSignal,

        veryLowSignal,

        dominantPattern,

        profiles,

        contradictions,

        topTraits,

        strongestQuestionSignals,

        dimensionTotals,

        behaviouralTraits:
        traits,

        behaviouralSummary: {

            continuityInstability:
                traits.continuityBreakdown +
                traits.restartCycling +
                traits.completionInstability,

            activationDifficulty:
                traits.activationFriction +
                traits.stalledMomentum,

            pressureDependence:
                traits.urgencyDependence +
                traits.pressureActivation,

            fragmentation:
                traits.fragmentation +
                traits.partialEngagement,

            exhaustion:
                traits.exhaustionAccumulation +
                traits.lowRecovery,

            emotionalInterference:
                traits.emotionalInterference +
                traits.emotionalCarryover

        }

    }

}