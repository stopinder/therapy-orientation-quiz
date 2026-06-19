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

                console.log("ENTITLEMENT CHECK START:", {
                    userId,
                    email,
                    normalizedEmail
                })

                // Create the OR query string
                // We match by user_id OR normalized email
                const queryParts = []
                if (userId) queryParts.push(`user_id.eq.${userId}`)
                if (normalizedEmail) queryParts.push(`email.eq.${normalizedEmail}`)

                const orQuery = queryParts.join(",")

                if (!orQuery) {
                    this.entitlement = null
                    this.loading = false
                    return
                }

                const {
                    data,
                    error
                } = await supabase
                    .from("course_entitlements")
                    .select("*")
                    .or(orQuery)
                    .order('created_at', { ascending: false })
                    .limit(1)
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

                const rowFound = !!data
                const isActive = data?.active === true
                const isFullCourse = data?.full_course === true
                const hasAccess = isActive && isFullCourse

                console.log("ENTITLEMENT RESULT:", {
                    rowFound,
                    active: isActive,
                    full_course: isFullCourse,
                    finalHasAccess: hasAccess
                })

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