import { COURSE_CHECKOUT_LINKS }
    from "../config/courseCheckoutLinks"

export const useCoursePurchases = () => {

    const purchaseFullProgramme = () => {

        window.location.href =
            COURSE_CHECKOUT_LINKS.fullProgramme

    }

    const purchaseWeek = (weekNumber) => {

        const checkoutUrl =
            COURSE_CHECKOUT_LINKS.weekly[weekNumber]

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