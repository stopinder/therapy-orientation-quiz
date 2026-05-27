import { computed } from "vue"

import { useEntitlementStore } from "../stores/entitlements"

const CHECKOUT_URL = import.meta.env.VITE_LEMON_CHECKOUT_URL

export function useCoursePurchases() {

    const entitlements = useEntitlementStore()

    const purchaseProgramme = () => {

        if (!CHECKOUT_URL) {
            console.error("Missing Lemon checkout URL")
            return
        }

        window.location.href = CHECKOUT_URL

    }

    const hasProgrammeAccess = computed(() => {

        return entitlements.items.some(
            (item) =>
                item.entitlement_key === "mindworksProgramme" &&
                item.status === "active"
        )

    })

    return {
        purchaseProgramme,
        hasProgrammeAccess
    }

}