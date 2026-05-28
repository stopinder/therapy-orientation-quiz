import { computed } from "vue"

import { useCourseProgressStore } from "../stores/courseProgress"

export function useContinuity() {

    const courseProgress =
        useCourseProgressStore()

    const lastActiveWeek =
        computed(() =>
            courseProgress.lastActiveWeek
        )

    const completedWeeks =
        computed(() =>
            courseProgress.completedWeeks
        )

    const isWeekCompleted =
        (weekNumber) => {

            return courseProgress.isWeekCompleted(
                weekNumber
            )

        }

    const isWeekActive =
        (weekNumber) => {

            return (
                weekNumber ===
                lastActiveWeek.value
            )

        }

    const nextRecommendedWeek =
        computed(() => {

            if (
                !completedWeeks.value.length
            ) {
                return 1
            }

            const highest =
                Math.max(
                    ...completedWeeks.value
                )

            return highest + 1

        })

    const shouldForegroundWeek =
        (weekNumber) => {

            if (
                isWeekCompleted(
                    weekNumber
                )
            ) {
                return false
            }

            return (
                weekNumber ===
                nextRecommendedWeek.value
            )

        }

    const continuityLabel =
        (weekNumber) => {

            if (
                isWeekCompleted(
                    weekNumber
                )
            ) {
                return "Completed"
            }

            if (
                isWeekActive(
                    weekNumber
                )
            ) {
                return "In Progress"
            }

            if (
                shouldForegroundWeek(
                    weekNumber
                )
            ) {
                return "Continue Forward"
            }

            return "Available"

        }

    return {

        lastActiveWeek,

        completedWeeks,

        nextRecommendedWeek,

        isWeekCompleted,

        isWeekActive,

        shouldForegroundWeek,

        continuityLabel

    }

}