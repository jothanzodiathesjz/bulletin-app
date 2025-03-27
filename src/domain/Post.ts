import type { IQueryMetadata } from "@/http/query-metadata";
import type { Timestamps } from "./shared/Timestamps";
import type { EmojiAttributes } from "./Emoji";

export type PostAttributes = & Timestamps & {
    id: number;
    title: string;
    body: string;
    user_id: number;
    viewcount: number;
    comment_count: number;
    reaction_count: number;
    reactions: EmojiAttributes[];
    board_id: number;
    user: User;
}

export type CommentsAttributes = & Timestamps & {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    user: User;
}

export type User = {
    id: number;
    username: string;
    fullname?: string;
}

export type TagsAttributes = & Timestamps & {
    id: number;
    name: string;
}

export type BoardPostAttributes = {
    id: number;
    name: string;
}

export type PostWithCommentsAndTags = & PostAttributes & {
    comments: CommentsAttributes[];
    tags: TagsAttributes[];
}

export type CreateCommentAttributes = {
    content: string;
    user_id: string;
}

export type PostToDataAttributes = {
    title: string;
    body: string;
    user_id: string;
    tags_id: number[];
    board_id: number;
}

export class DomainPost {
    id: number;
    title: string;
    body: string;
    user_id: number;
    viewcount: number;
    reaction_count: number;
    comment_count: number;
    updated_at?: string;
    deleted_at?: string;
    created_at: string;
    constructor(
        init: PostAttributes,
    ) {
        this.id = init.id;
        this.body = init.body;
        this.title = init.title;
        this.user_id = init.user_id;
        this.viewcount = init.viewcount;
        this.comment_count = init.comment_count;
        this.reaction_count = init.reaction_count;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
        this.created_at = init.created_at;
    }

    static formDataEmpty(): PostToDataAttributes {
        return {
            body: "",
            title: "",
            user_id: "",
            board_id: 0,
            tags_id: []
        }
    }
}

export type PostResponseArray = {
    data: PostWithCommentsAndTags[];
    next_page?: string;
    previous_page?: string;
    per_page?: number;
    current_page?: number;
    total?: number;
}

export interface PostRepository {
    getAllPost(query?: IQueryMetadata): Promise<PostResponseArray>
    get(id: string): Promise<PostWithCommentsAndTags>
    createComent(comment: CreateCommentAttributes, postId: string): Promise<PostWithCommentsAndTags>
    createPost(data: PostToDataAttributes): Promise<PostAttributes>;
    updatePost(data: PostToDataAttributes, id: string): Promise<PostAttributes>;
    delete(id: string): Promise<PostAttributes>;
    postView(id: string): Promise<string>
}