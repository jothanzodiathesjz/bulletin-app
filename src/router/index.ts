import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: 'home',
            component: () => import('@/index/Index.vue')
        },
        {
            path: "/login",
            name: 'login',
            component: () => import('@/auth/Login.vue')
        }
    ]
})

export default router;