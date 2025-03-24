import { defineStore } from "pinia";
import { DomainUser } from "@/domain/User";
import { ref, computed } from "vue";
import container from "@/di";
import { DomainAuth } from "@/domain/Auth";
import { TOKENS } from "@/tokens";
import { useRouter } from "vue-router";

const repository = container.get(TOKENS.authRepository);
export const useAuthStore = defineStore("auth-store", () => {
    const router = useRouter()
    const user = ref<DomainUser | null>(null);

    const isAuthenticated = computed(() => user.value !== null);

    async function login(auth: DomainAuth) {
        const data = await repository.login(auth);
        console.log("cliked from auth");
        user.value = data;
        localStorage.setItem("user", JSON.stringify(data));
        router.push({ name: 'home' })
    }

    async function logout() { }
    function setUser() {
        if (user.value !== null) {
            return;
        }
        const res = localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user") ?? "")
            : null;
        user.value = res;
    }

    return { user, isAuthenticated, login, logout, setUser };
});
