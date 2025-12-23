import { createRouter, createWebHistory } from "vue-router"

import About from "../views/About.vue"
import QuizGateway from "../views/QuizGateway.vue"
import ADHDQuizView from "../views/ADHDQuizView.vue"

import TermsView from "../views/TermsView.vue"
import PrivacyView from "../views/PrivacyView.vue"
import ContactView from "../views/ContactView.vue"

const routes = [
    { path: "/", redirect: "/about" },

    { path: "/about", name: "About", component: About },

    { path: "/terms", name: "Terms", component: TermsView },
    { path: "/privacy", name: "Privacy", component: PrivacyView },
    { path: "/contact", name: "Contact", component: ContactView },

    { path: "/gateway", name: "Gateway", component: QuizGateway },

    {
        path: "/adhd-quiz",
        name: "ADHDQuiz",
        component: ADHDQuizView,
        meta: { requiresGateway: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresGateway && !sessionStorage.getItem("passedGateway")) {
        next("/gateway")
    } else {
        next()
    }
})

export default router
