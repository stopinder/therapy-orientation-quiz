import { computed } from "vue"

import { useEntitlementStore } from "../stores/entitlements"

import { COURSE_CHECKOUT } from "../config/courseCheckoutLinks"

export function useCoursePurchases() {

    const entitlements =
        useEntitlementStore()

    const purchaseProgramme = () => {

        if (!COURSE_CHECKOUT.checkoutUrl) {

            console.error(
                "Missing Lemon checkout URL"
            )

            return

        }

        window.location.href =
            COURSE_CHECKOUT.checkoutUrl

    }

    const hasProgrammeAccess =
        computed(() => {

            return (
                entitlements.entitlement?.full_course === true &&
                entitlements.entitlement?.active === true
            )

        })

    return {

        purchaseProgramme,

        hasProgrammeAccess

    }

}