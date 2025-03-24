import type { BoardAttributes, BoardRepository } from "@/domain/Board";
import type { HttpClient } from "@/http/http";
import { TOKENS } from "@/tokens";
import { injected } from "brandi";

export class BoardHttpRepository implements BoardRepository {
    client: HttpClient;

    constructor(
        client: HttpClient
    ) {
        this.client = client
    }

    async getAll(): Promise<BoardAttributes[]> {
        const response = await this.client.GET('/api/board');
        return response.data as BoardAttributes[]
    }
}

injected(
    BoardHttpRepository,
    TOKENS.httpClient
)