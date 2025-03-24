import type { AuthRepository, DomainAuth } from "@/domain/Auth";
import { DomainUser } from "@/domain/User";
import type { HttpClient } from "@/http/http";
import { TOKENS } from "@/tokens";
import { injected } from "brandi";

export class AuthHttpRepository implements AuthRepository {
    client: HttpClient;

    constructor(
        client: HttpClient
    ) {
        this.client = client;
    }

    async login(auth: DomainAuth): Promise<DomainUser> {
        console.log('testing')
        const response = await this.client.POST('/api/login', {
            body: JSON.stringify(auth)
        })
        if ((response).token) {
            localStorage.setItem("token", JSON.stringify(response.token ?? "{}"));
        }
        return new DomainUser(response.data)
    }
}

injected(
    AuthHttpRepository,
    TOKENS.httpClient
)