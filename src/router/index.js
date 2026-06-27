import { createRouter, createWebHistory } from "vue-router"

import AuthView from "../views/AuthView.vue"
import ResetPasswordView from "../views/ResetPasswordView.vue"

import About from "../views/About.vue"
import QuizGateway from "../views/QuizGateway.vue"
import ADHDQuizView from "../views/ADHDQuizView.vue"

import CourseHubView from "../views/CourseHubView.vue"
import CourseWeekView from "../views/CourseWeekView.vue"

import AccessDeniedView from "../views/AccessDeniedView.vue"

import DeepDiveView from "../views/DeepDiveView.vue"
import ProgrammeView from "../views/ProgrammeView.vue"
import ReflectionHistoryView from "../views/ReflectionHistoryView.vue"
import LandingPageView from "../views/LandingPageView.vue"

import TermsView from "../views/TermsView.vue"
import PrivacyView from "../views/PrivacyView.vue"
import ContactView from "../views/ContactView.vue"

import AuthDebugView from "../views/AuthDebugView.vue"

import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

import { courseWeeks } from "../data/courseWeeks"

const validWeekNumbers =
    courseWeeks.map(
        (week) => week.number
    )

const routes = [

    {
        path: "/",
        name: "Home",
        component: LandingPageView
    },

    {
        path: "/landing",
        redirect: "/"
    },

    {
        path: "/about",
        name: "About",
        component: About
    },

    {
        path: "/terms",
        name: "Terms",
        component: TermsView
    },

    {
        path: "/privacy",
        name: "Privacy",
        component: PrivacyView
    },

    {
        path: "/contact",
        name: "Contact",
        component: ContactView
    },


    {
        path: "/auth",
        name: "Auth",
        component: AuthView
    },

    {
        path: "/reset-password",
        name: "ResetPassword",
        component: ResetPasswordView
    },

    {
        path: "/gateway",
        name: "Gateway",
        component: QuizGateway
    },

    {
        path: "/adhd-quiz",
        name: "ADHDQuiz",
        component: ADHDQuizView,

        meta: {
            requiresGateway: true
        }
    },

    {
        path: "/deep-dive",
        name: "DeepDive",
        component: DeepDiveView,

        meta: {
            requiresGateway: true
        }
    },

    {
        path: "/programme",
        name: "Programme",
        component: ProgrammeView
    },

    {
        path: "/course",
        name: "CourseHub",
        component: CourseHubView,

        meta: {
            requiresAuth: true,
            requiresCourseAccess: true
        }
    },

    {
        path: "/course/:weekNumber",
        name: "CourseWeek",
        component: CourseWeekView,

        meta: {
            requiresAuth: true,
            requiresCourseAccess: true
        }
    },

    {
        path: "/continuity",
        name: "Continuity",
        component: ReflectionHistoryView,

        meta: {
            requiresAuth: true,
            requiresCourseAccess: true
        }
    },

    {
        path: "/access-denied",
        name: "AccessDenied",
        component: AccessDeniedView
    },

    {
        path: "/auth-debug",
        name: "AuthDebug",
        component: AuthDebugView
    }

]

const router = createRouter({

    history: createWebHistory(),

    routes,

    scrollBehavior(to, from, savedPosition) {

        if (savedPosition) {
            return savedPosition
        }

        return {
            top: 0,
            behavior: "smooth"
        }

    }

})

router.beforeEach(async (to, from, next) => {

    const auth =
        useAuthStore()

    const entitlements =
        useEntitlementStore()

    if (
        to.meta.requiresGateway &&
        !sessionStorage.getItem("passedGateway")
    ) {

        next("/gateway")
        return

    }

    if (
        to.meta.requiresAuth &&
        !auth.user
    ) {

        next("/auth")
        return

    }

    if (
        to.meta.requiresCourseAccess
    ) {

        // If we are still loading entitlements, we should wait.
        // This is important for the first load of the app.
        if (entitlements.loading) {
            // We can't really "await" here easily without a promise, 
            // but we can check if it's already loading and wait for it.
            // Actually, hydrateApp usually handles the initial fetch.
            // But if it's still loading (e.g. slow API), we wait.
            
            const waitForEntitlements = () => {
                return new Promise((resolve) => {
                    const unwatch = entitlements.$subscribe((mutation, state) => {
                        if (!state.loading) {
                            unwatch()
                            resolve()
                        }
                    })
                    // Safety timeout
                    setTimeout(() => {
                        unwatch()
                        resolve()
                    }, 5000)
                })
            }
            
            if (entitlements.loading) {
                await waitForEntitlements()
            }
        }

        if (!entitlements.isActive) {
            next("/access-denied")
            return
        }

        // Additional check for specific weeks if needed
        if (to.name === "CourseWeek") {
             const weekNumber = Number(to.params.weekNumber)
             if (!entitlements.canAccessWeek(weekNumber)) {
                 next("/access-denied")
                 return
             }
        }
    }

    if (
        to.name === "CourseWeek"
    ) {

        const weekNumber =
            Number(
                to.params.weekNumber
            )

        if (
            !validWeekNumbers.includes(
                weekNumber
            )
        ) {

            next("/course")
            return

        }

    }

    next()

})

export default router