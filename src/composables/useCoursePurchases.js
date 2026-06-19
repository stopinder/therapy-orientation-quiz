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

            const entitlement = entitlements.entitlement
            const active = entitlement?.active === true
            const fullCourse = entitlement?.full_course === true
            const hasAccess = active && fullCourse

            return hasAccess

        })

    return {

        purchaseProgramme,

        hasProgrammeAccess

    }

}