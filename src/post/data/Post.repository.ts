import type { CreateCommentAttributes, PostAttributes, PostRepository, PostResponseArray, PostToDataAttributes, PostWithCommentsAndTags } from "@/domain/Post";
import type { HttpClient } from "@/http/http";
import type { IQueryMetadata } from "@/http/query-metadata";
import { TOKENS } from "@/tokens";
import { injected } from "brandi";

export class PostRepositoryHttp implements PostRepository {
    client: HttpClient;

    constructor(
        client: HttpClient
    ) {
        this.client = client;
    }

    async getAllPost(query?: IQueryMetadata): Promise<PostResponseArray> {
        console.log(query)
        const response = await this.client.GET('/api/posts', query)
        if (!response.data) {
            throw new Error('Terjadi Kesalahan')
        }

        return {
            data: response.data as PostWithCommentsAndTags[],
            next_page: response.next_page,
            per_page: response.per_page,
            current_page: response.current_page,
            previous_page: response.previous_page,
            total: response.total
        };
    }
    async getAllPostDashboard(query?: IQueryMetadata): Promise<PostResponseArray> {
        const response = await this.client.GET('/api/dashboard', query)
        if (!response.data) {
            throw new Error('Terjadi Kesalahan')
        }

        return {
            data: response.data as PostWithCommentsAndTags[],
            next_page: response.next_page,
            per_page: response.per_page,
            current_page: response.current_page,
            previous_page: response.previous_page,
            total: response.total
        };
    }

    async get(id: string): Promise<PostWithCommentsAndTags> {
        const response = await this.client.GET(`/api/posts/${id}`)

        if (!response.data) throw new Error('Terjadi Kesalahan')

        return response.data as PostWithCommentsAndTags
    }
    async getOneDashboard(id: string): Promise<PostWithCommentsAndTags> {
        const response = await this.client.GET(`/api/dashboard/${id}`)

        if (!response.data) throw new Error('Terjadi Kesalahan')

        return response.data as PostWithCommentsAndTags
    }

    async createComent(comment: CreateCommentAttributes, postId: string): Promise<PostWithCommentsAndTags> {
        const response = await this.client.POST(`/api/posts/${postId}/comments`, {
            body: JSON.stringify(comment)
        })

        return response.data as PostWithCommentsAndTags
    }

    async createPost(data: PostToDataAttributes): Promise<PostAttributes> {
        console.log(data)
        const response = await this.client.POST('/api/posts', {
            body: JSON.stringify(data)
        })

        return response.data as unknown as PostAttributes
    }

    async updatePost(data: PostToDataAttributes, id: string): Promise<PostAttributes> {
        const response = await this.client.PATCH(`/api/posts/${id}`, {
            body: JSON.stringify(data)
        })

        return response.data as unknown as PostAttributes;
    }

    async delete(id: string): Promise<PostAttributes> {
        const response = await this.client.DELETE(`/api/posts/${id}`)
        return response.data as PostAttributes
    }

    async postView(id: string): Promise<string> {
        const response = await this.client.POST(`/api/posts/${id}/view`);
        return response.data as string;
    }
}

injected(
    PostRepositoryHttp,
    TOKENS.httpClient
)