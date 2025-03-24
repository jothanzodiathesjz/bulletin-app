import type { UserPostAttributes } from "./User";

export type EmojiAttributes = {
    id: number;
    emoji: string;
    post_id: number;
    user: UserPostAttributes;
}


export interface EmojiRepository {
    Post(emoji: string, id_post: number): Promise<EmojiAttributes>
}