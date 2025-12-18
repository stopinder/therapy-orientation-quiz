import { createRouter, createWebHistory } from "vue-router"
import ADHDQuizView from "../views/ADHDQuizView.vue"
import About from "../views/About.vue"

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
    {
        path: "/about",
        name: "About",
        component: About,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
