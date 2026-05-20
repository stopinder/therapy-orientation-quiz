import { createRouter, createWebHistory } from "vue-router"

import About from "../views/About.vue"
import QuizGateway from "../views/QuizGateway.vue"
import ADHDQuizView from "../views/ADHDQuizView.vue"

import DeepDiveView from "../views/DeepDiveView.vue"
import ProgrammeView from "../views/ProgrammeView.vue"

import TermsView from "../views/TermsView.vue"
import PrivacyView from "../views/PrivacyView.vue"
import ContactView from "../views/ContactView.vue"

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
    if (
        to.meta.requiresGateway &&
        !sessionStorage.getItem("passedGateway")
    ) {
        next("/gateway")
    } else {
        next()
    }
})

export default router