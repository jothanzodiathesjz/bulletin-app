import type { UserAuthAttributes } from "./Auth";

export type UserAttributes = {
    id: string;
    username: string;
    is_admin: number;
    fullname: string;
    is_head: number;
    board_id: number;
}

export class DomainUser {
    id: string;
    username: string;
    is_admin: number;
    fullname: string;
    is_head: number;
    board_id: number;
    constructor(data: UserAttributes) {
        this.id = data.id;
        this.username = data.username;
        this.is_admin = data.is_admin;
        this.fullname = data.fullname;
        this.is_head = data.is_head;
        this.board_id = data.board_id;
    }

    static empty() {
        return new DomainUser({
            id: "",
            username: "",
            is_admin: 0,
            board_id: 0,
            fullname: "",
            is_head: 0
        })
    }
}

export type UserPostAttributes = {
    id: number;
    username: string;
    fullname?: string;
}

export interface UserRepository {
    getAllUser(): Promise<DomainUser[]>;
    deleteUser(id_post: string): Promise<DomainUser[]>;
    create(auth: UserAuthAttributes, user: DomainUser): Promise<DomainUser>;
    update(user: DomainUser): Promise<DomainUser>;
    get(id: string): Promise<DomainUser>;
}