import { COURSE_CHECKOUT_LINKS }
    from "../config/courseCheckoutLinks"

export const useCoursePurchases = () => {

    const purchaseFullProgramme = () => {

        console.log(
            "FULL PROGRAMME URL:",
            COURSE_CHECKOUT_LINKS.fullProgramme
        )

        window.location.href =
            COURSE_CHECKOUT_LINKS.fullProgramme

    }

    const purchaseWeek = (weekNumber) => {

        console.log(
            "CLICKED WEEK:",
            weekNumber
        )

        console.log(
            "ALL WEEKLY LINKS:",
            COURSE_CHECKOUT_LINKS.weekly
        )

        const checkoutUrl =
            COURSE_CHECKOUT_LINKS.weekly[weekNumber]

        console.log(
            "RESOLVED CHECKOUT URL:",
            checkoutUrl
        )

        if (!checkoutUrl) {

            console.error(
                `Missing checkout URL for week ${weekNumber}`
            )

            return

        }

        window.location.href = checkoutUrl

    }

    return {
        purchaseFullProgramme,
        purchaseWeek
    }

}