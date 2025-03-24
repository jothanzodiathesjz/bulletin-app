import type { TagsAttributes, TagsRepository } from "@/domain/Tags";
import type { HttpClient } from "@/http/http";
import { TOKENS } from "@/tokens";
import { injected } from "brandi";

export class TagsHttpRepository implements TagsRepository {
    client: HttpClient;

    constructor(
        client: HttpClient
    ) {
        this.client = client;
    }

    async get(): Promise<TagsAttributes[]> {
        const response = await this.client.GET(`/api/tags`);
        return response.data as TagsAttributes[];
    }
}

injected(
    TagsHttpRepository,
    TOKENS.httpClient
)