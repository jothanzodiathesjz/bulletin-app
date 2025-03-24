import { DomainUser, type UserAttributes } from "./User";

export type AuthAttributes = {
    username: string;
    password: string;
}

export type UserAuthAttributes = {
    password: string;
    password_confirmation: string;
}

export class DomainAuth {
    username: string;
    password: string;

    constructor(data: AuthAttributes) {
        this.username = data.username;
        this.password = data.password;
    }

    static fromData(data: UserAttributes): DomainUser {
        return new DomainUser(data)
    }
}

export interface AuthRepository {
    login(auth: DomainAuth): Promise<DomainUser>
}