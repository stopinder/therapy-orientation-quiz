import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useCourseProgressStore = defineStore("courseProgress", {
    state: () => ({
        progress: [],
        loading: false,
        error: null
    }),

    getters: {
        completedWeeks: (state) =>
            state.progress
                .filter((item) => item.completed === true)
                .map((item) => item.week_id),

        isWeekCompleted: (state) => (weekId) =>
            state.progress.some(
                (item) => item.week_id === weekId && item.completed === true
            ),

        lastActiveWeek: (state) => {
            if (!state.progress.length) return 1

            const sorted = [...state.progress].sort((a, b) => {
                return new Date(b.updated_at) - new Date(a.updated_at)
            })

            return sorted[0]?.week_id || 1
        }
    },

    actions: {
        async fetchProgress(userId) {
            if (!userId) return

            this.loading = true
            this.error = null

            const { data, error } = await supabase
                .from("course_progress")
                .select("*")
                .eq("user_id", userId)
                .order("week_id", { ascending: true })

            if (error) {
                this.error = error.message
                this.loading = false
                return
            }

            this.progress = data || []
            this.loading = false
        },

        async markWeekStarted(userId, weekId, lastPosition = "started") {
            if (!userId || !weekId) return

            const { data, error } = await supabase
                .from("course_progress")
                .upsert(
                    {
                        user_id: userId,
                        week_id: weekId,
                        last_position: lastPosition,
                        updated_at: new Date().toISOString()
                    },
                    {
                        onConflict: "user_id,week_id"
                    }
                )
                .select()
                .single()

            if (error) {
                this.error = error.message
                return
            }

            this.upsertLocalProgress(data)
        },

        async markWeekCompleted(userId, weekId) {
            if (!userId || !weekId) return

            const { data, error } = await supabase
                .from("course_progress")
                .upsert(
                    {
                        user_id: userId,
                        week_id: weekId,
                        completed: true,
                        completed_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        onConflict: "user_id,week_id"
                    }
                )
                .select()
                .single()

            if (error) {
                this.error = error.message
                return
            }

            this.upsertLocalProgress(data)
        },

        upsertLocalProgress(item) {
            const index = this.progress.findIndex(
                (existing) => existing.week_id === item.week_id
            )

            if (index >= 0) {
                this.progress[index] = item
            } else {
                this.progress.push(item)
            }
        }
    }
})