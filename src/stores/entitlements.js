import { defineStore } from "pinia"

import { supabase } from "../lib/supabase"

export const useEntitlementStore = defineStore(
    "entitlements",
    {

        state: () => ({

            entitlement: null,

            loading: false

        }),

        getters: {

            hasFullCourse: (state) =>

                state.entitlement?.full_course === true,

            unlockedWeeks: (state) =>

                state.entitlement?.unlocked_weeks || [],

            isActive: (state) =>

                state.entitlement?.active === true

        },

        actions: {

            async fetchEntitlements(userId, email) {

                this.loading = true

                const normalizedEmail = email?.trim().toLowerCase()

                if (!normalizedEmail) {
                    this.entitlement = null
                    this.loading = false
                    return
                }

                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    const token = session?.access_token

                    const response = await fetch("/api/check-course-access", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ email: normalizedEmail })
                    })

                    const data = await response.json()
                    
                    const hasAccess = data?.hasAccess === true
                    
                    // We set a mock entitlement object that satisfies the getters
                    this.entitlement = hasAccess ? {
                        active: true,
                        full_course: true,
                        email: normalizedEmail
                    } : null

                } catch (error) {
                    console.error("ENTITLEMENT API ERROR:", error)
                    this.entitlement = null
                } finally {
                    this.loading = false
                }
            },

            canAccessWeek(weekNumber) {

                if (!this.entitlement) {

                    return false

                }

                if (!this.isActive) {

                    return false

                }

                // Full programme unlocks everything

                if (this.hasFullCourse) {

                    return true

                }

                // Legacy support

                return this.unlockedWeeks.includes(
                    Number(weekNumber)
                )

            }

        }

    }
)