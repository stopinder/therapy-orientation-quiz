import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

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
                console.error(error)
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

            supabase.auth.onAuthStateChange(
                (event, session) => {

                    this.user =
                        session?.user || null

                }
            )

        }

    }

})