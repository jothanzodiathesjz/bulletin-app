import type { UserAuthAttributes } from "@/domain/Auth";
import { DomainUser, type UserAttributes, type UserRepository } from "@/domain/User";
import type { HttpClient } from "@/http/http";
import { TOKENS } from "@/tokens";
import { injected } from "brandi";

export class UserHttpRepository implements UserRepository {
    client: HttpClient;
    constructor(client: HttpClient) {
        this.client = client;
    }
    async getAllUser(): Promise<DomainUser[]> {
        const response = await this.client.GET('/api/users');
        return response.data?.map((v: UserAttributes) => new DomainUser(v))
    }

    async deleteUser(id_post: string): Promise<DomainUser[]> {
        const response = await this.client.DELETE('users/' + id_post);
        return response.data?.map((v: UserAttributes) => new DomainUser(v))
    }

    async create(auth: UserAuthAttributes, user: DomainUser): Promise<DomainUser> {
        const response = await this.client.POST(`/api/users`, {
            body: JSON.stringify({
                ...auth,
                ...user
            })
        })
        return new DomainUser(response.data)
    }
    async update(user: DomainUser): Promise<DomainUser> {
        const response = await this.client.PATCH(`/api/users/` + user.id, {
            body: JSON.stringify(user)
        })
        return new DomainUser(response.data)
    }

    async get(id: string): Promise<DomainUser> {
        const response = await this.client.GET('/api/users/' + id);
        return new DomainUser(response.data)
    }
}

injected(
    UserHttpRepository,
    TOKENS.httpClient
)