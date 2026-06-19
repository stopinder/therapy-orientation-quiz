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

                // Try by user_id first, then by email if requested
                let query = supabase
                    .from("course_entitlements")
                    .select("*")

                if (userId && email) {
                    query = query.or(`user_id.eq.${userId},email.eq.${email}`)
                } else if (userId) {
                    query = query.eq("user_id", userId)
                } else if (email) {
                    query = query.eq("email", email)
                }

                const {
                    data,
                    error
                } = await query.order('created_at', { ascending: false }).limit(1)

                if (error) {

                    console.error(
                        "ENTITLEMENT ERROR:",
                        error
                    )

                    this.entitlement = null

                    this.loading = false

                    return

                }

                this.entitlement =
                    data?.[0] || null

                this.loading = false

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