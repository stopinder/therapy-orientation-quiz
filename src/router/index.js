import { createRouter, createWebHistory } from "vue-router"

import AuthView from "../views/AuthView.vue"
import ResetPasswordView from "../views/ResetPasswordView.vue"

import About from "../views/About.vue"
import QuizGateway from "../views/QuizGateway.vue"
import ADHDQuizView from "../views/ADHDQuizView.vue"

import CourseHubView from "../views/CourseHubView.vue"
import CourseWeek1View from "../views/CourseWeek1View.vue"

import AccessDeniedView from "../views/AccessDeniedView.vue"

import DeepDiveView from "../views/DeepDiveView.vue"
import ProgrammeView from "../views/ProgrammeView.vue"

import TermsView from "../views/TermsView.vue"
import PrivacyView from "../views/PrivacyView.vue"
import ContactView from "../views/ContactView.vue"

import AuthDebugView from "../views/AuthDebugView.vue"

import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

const routes = [
    {
        path: "/",
        redirect: "/about"
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
            requiresAuth: true
        }
    },

    {
        path: "/course/week-1",
        name: "CourseWeek1",
        component: CourseWeek1View,
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

router.beforeEach((to, from, next) => {

    const auth = useAuthStore()
    const entitlements = useEntitlementStore()

    if (
        to.meta.requiresGateway &&
        !sessionStorage.getItem("passedGateway")
    ) {
        next("/gateway")
        return
    }

    if (to.meta.requiresAuth && !auth.user) {
        next("/auth")
        return
    }

    if (
        to.meta.requiresCourseAccess &&
        !entitlements.canAccessWeek(1)
    ) {
        next("/access-denied")
        return
    }

    next()

})

export default router