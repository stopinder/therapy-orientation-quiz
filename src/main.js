import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Keep the existing Vue/Vite/Pinia foundation. This quiz needs no account hydration.
createApp(App).use(createPinia()).use(router).mount('#app')
