import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import "./style.css" // or tailwind import if you have one

createApp(App).use(router).mount("#app")
