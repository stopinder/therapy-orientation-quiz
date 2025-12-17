import { createRouter, createWebHistory } from "vue-router"
import ADHDQuizView from "../views/ADHDQuizView.vue"

const routes = [
    {
        path: "/",
        redirect: "/adhd-quiz",
    },
    {
        path: "/adhd-quiz",
        name: "ADHDQuiz",
        component: ADHDQuizView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
