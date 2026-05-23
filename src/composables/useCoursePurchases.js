import { COURSE_VARIANTS }
    from "../config/courseVariants"

const STORE_URL =
    "https://gpttherapyassist.lemonsqueezy.com"

export const useCoursePurchases = () => {

    const redirectToCheckout = (variantId) => {

        if (!variantId) {

            console.error(
                "Missing Lemon Squeezy variant ID"
            )

            return

        }

        const checkoutUrl =
            `${STORE_URL}/checkout/buy/${variantId}`

        window.location.href = checkoutUrl

    }

    const purchaseFullProgramme = () => {

        redirectToCheckout(
            COURSE_VARIANTS.fullProgramme.variantId
        )

    }

    const purchaseWeek = (weekNumber) => {

        const variant =
            COURSE_VARIANTS.weekly[weekNumber]

        if (!variant) {

            console.error(
                `Missing variant for week ${weekNumber}`
            )

            return

        }

        redirectToCheckout(
            variant.variantId
        )

    }

    return {
        purchaseFullProgramme,
        purchaseWeek
    }

}