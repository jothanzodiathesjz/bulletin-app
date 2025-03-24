import type { EmojiAttributes, EmojiRepository } from "@/domain/Emoji";
import type { HttpClient } from "@/http/http";
import { TOKENS } from "@/tokens";
import { injected } from "brandi";

export class EmojiHttpRepository implements EmojiRepository {
    client: HttpClient;

    constructor(
        client: HttpClient
    ) {
        this.client = client
    }

    async Post(emoji: string, id_post: number): Promise<EmojiAttributes> {
        const response = await this.client.POST('/api/posts/' + id_post + '/reaction', {
            body: JSON.stringify({ emoji: emoji })
        })
        return response.data as EmojiAttributes;
    }
}

injected(
    EmojiHttpRepository,
    TOKENS.httpClient
)