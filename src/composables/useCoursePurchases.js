import { computed } from "vue"
import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

import { COURSE_CHECKOUT } from "../config/courseCheckoutLinks"

export function useCoursePurchases() {

    const auth = useAuthStore()
    const entitlements =
        useEntitlementStore()

    const purchaseProgramme = () => {

        if (!COURSE_CHECKOUT.checkoutUrl) {

            console.error(
                "Missing Lemon checkout URL"
            )

            return

        }

        let checkoutUrl = COURSE_CHECKOUT.checkoutUrl

        if (auth.user?.email) {
            const url = new URL(checkoutUrl)
            url.searchParams.set('checkout[email]', auth.user.email)
            url.searchParams.set('custom[email]', auth.user.email)
            checkoutUrl = url.toString()
        }

        window.location.href = checkoutUrl

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