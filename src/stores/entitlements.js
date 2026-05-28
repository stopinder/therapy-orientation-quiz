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

            async fetchEntitlements(userId) {

                this.loading = true

                const {
                    data,
                    error
                } = await supabase
                    .from("course_entitlements")
                    .select("*")
                    .eq("user_id", userId)
                    .maybeSingle()

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
                    data || null

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