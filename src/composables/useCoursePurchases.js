import { computed } from "vue"

import { useEntitlementStore } from "../stores/entitlements"
import { useAuthStore } from "../stores/auth"

import { COURSE_CHECKOUT } from "../config/courseCheckoutLinks"

export function useCoursePurchases() {

    const entitlements =
        useEntitlementStore()

    const auth = useAuthStore()

    const purchaseProgramme = () => {

        if (!COURSE_CHECKOUT.checkoutUrl) {

            console.error(
                "Missing Lemon checkout URL"
            )

            return

        }

        const successUrl = "https://mindworks.works/payment-success"
        const checkoutUrl = new URL(COURSE_CHECKOUT.checkoutUrl)
        
        // Append redirect_url to Lemon Squeezy checkout
        checkoutUrl.searchParams.set("redirect_url", successUrl)

        window.location.href = checkoutUrl.toString()

    }

    const hasProgrammeAccess =
        computed(() => {

            const hasAccess = (
                entitlements.entitlement?.full_course === true &&
                entitlements.entitlement?.active === true &&
                (
                    entitlements.entitlement?.user_id === auth.user?.id ||
                    entitlements.entitlement?.email === auth.user?.email
                )
            )

            console.log("--- Entitlement Diagnostic ---")
            console.log("Auth User ID:", auth.user?.id)
            console.log("Auth User Email:", auth.user?.email)
            console.log("Entitlement Record:", entitlements.entitlement)
            console.log("Entitlement Loading:", entitlements.loading)
            console.log("Computed hasProgrammeAccess:", hasAccess)

            return hasAccess

        })

    const loading =
        computed(() => entitlements.loading)

    return {

        purchaseProgramme,

        hasProgrammeAccess,

        loading

    }

}