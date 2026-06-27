import { computed } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"
import { supabase } from "../lib/supabase"

import { COURSE_CHECKOUT } from "../config/courseCheckoutLinks"

export function useCoursePurchases() {

    const router = useRouter()
    const auth = useAuthStore()
    const entitlements =
        useEntitlementStore()

    const purchaseProgramme = async () => {

        if (!COURSE_CHECKOUT.checkoutUrl) {

            console.error(
                "Missing Lemon checkout URL"
            )

            return

        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user?.email) {
            router.push("/auth")
            return
        }

        const email = user.email.trim().toLowerCase()
        console.log("Checkout user email:", email)

        let checkoutUrl = COURSE_CHECKOUT.checkoutUrl

        const url = new URL(checkoutUrl)
        url.searchParams.set('checkout[email]', email)
        url.searchParams.set('custom[email]', email)
        url.searchParams.set('embed', '0') // Ensure full page for redirect
        url.searchParams.set('enabled', '1') 
        
        // Use the current origin for the redirect URL
        const returnUrl = `${window.location.origin}/payment-success`
        url.searchParams.set('redirect_url', returnUrl)
        
        checkoutUrl = url.toString()

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