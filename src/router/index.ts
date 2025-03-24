import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/post",
            component: () => import('@/layouts/MainLayout.vue'),
            children: [
                {
                    path: "",
                    name: "home",
                    component: () => import('@/post/Post.vue'),
                },
                {
                    path: ":id",
                    name: "post",
                    component: () => import('@/post/Post.detail.vue'),
                }
            ]
        },
        {
            path: '/dashboard',
            component: () => import('@/layouts/admin/DashbordLayout.vue'),
            children: [
                {
                    path: "post-list",
                    children: [
                        {
                            path: "",
                            name: "dashboard-post-list",
                            component: () => import('@/post/PostList.dashboard.vue'),
                        },
                        {
                            path: "create",
                            name: "dashboard-post-create",
                            component: () => import('@/post/Post.form.vue'),
                        },
                        {
                            path: ":id",
                            name: "dashboard-post-edit",
                            component: () => import('@/post/Post.form.vue'),
                        }
                    ]
                },
                {
                    path: "tags",
                    name: "dashboard-post-tags",
                    component: () => import('@/tags/TagsList.vue'),
                },
                {
                    path: "users",
                    children: [
                        {
                            path: "",
                            name: "dashboard-user-list",
                            component: () => import('@/users/UsersList.vue')
                        },
                        {
                            path: "create",
                            name: "dashboard-user-create",
                            component: () => import('@/users/User.form.vue'),
                        },
                        {
                            path: ":id",
                            name: "dashboard-user-edit",
                            component: () => import('@/users/User.form.vue'),
                        }
                    ]
                }

            ]
        },
        {
            path: "/login",
            name: 'login',
            component: () => import('@/auth/Login.vue')
        },
        // Add a redirect for root path
        {
            path: "/",
            redirect: { name: 'home' }
        },
        // Add a catch-all 404 route
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: () => import('@/views/NotFound.vue') // You'll need to create this component
        }
    ]
})

router.beforeEach(async (to, _, next) => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (to.path === "/" && !to.name) {  // Tambahkan pengecekan !to.name
        next({ name: 'home' });
        return
    }

    if (to.path.startsWith("/dashboard")) {
        // Jika pengguna belum login, arahkan ke halaman login
        if (!user) {
            next({ name: 'login' });
            return;
        }

        // Jika pengguna bukan kepala, arahkan ke halaman not-found
        if (!user.is_head) {
            next({ name: 'not-found' });
            return;
        }

        // Jika pengguna adalah kepala, izinkan akses
        next();
        return;
    }

    if (to.name === 'post') {
        if (!user) {
            next({ name: 'login' });
        }
        next()
        return
    }
    next(); // Jangan lupa untuk selalu memanggil next()
})

export default router;