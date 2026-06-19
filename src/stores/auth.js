import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"
import { useEntitlementStore } from "./entitlements"

export const useAuthStore = defineStore("auth", {

    state: () => ({
        user: null,
        loading: true
    }),

    getters: {
        isLoggedIn: (state) => !!state.user
    },

    actions: {

        async fetchUser() {

            this.loading = true

            const { data, error } =
                await supabase.auth.getUser()

            if (error) {
                if (error.name !== "AuthSessionMissingError") {
                    console.error("Auth user fetch error:", error)
                }
            }

            this.user =
                data?.user || null

            this.loading = false

        },

        async signOut() {

            await supabase.auth.signOut()

            this.user = null

        },

        listenForAuthChanges() {

            const entitlements = useEntitlementStore()

            supabase.auth.onAuthStateChange(
                async (event, session) => {

                    this.user =
                        session?.user || null

                    if (this.user) {
                        await entitlements.fetchEntitlements(
                            this.user.id,
                            this.user.email
                        )
                    } else {
                        entitlements.entitlement = null
                    }

                }
            )

        }

    }

})