import type { Timestamps } from "./shared/Timestamps";

export type TagsAttributes = & Timestamps & {
    id: number;
    name: string;
}

export interface TagsRepository {
    get(): Promise<TagsAttributes[]>
}