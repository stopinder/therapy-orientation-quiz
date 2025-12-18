import { createRouter, createWebHistory } from "vue-router"
import About from "../views/About.vue"
import QuizGateway from "../views/QuizGateway.vue"
import ADHDQuizView from "../views/ADHDQuizView.vue"

const routes = [
    { path: "/", redirect: "/about" },
    { path: "/about", name: "About", component: About },
    { path: "/gateway", name: "Gateway", component: QuizGateway },
    { path: "/adhd-quiz", name: "ADHDQuiz", component: ADHDQuizView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
