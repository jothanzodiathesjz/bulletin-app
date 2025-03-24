
import type { Timestamps } from "./shared/Timestamps";

export type BoardAttributes = & Timestamps & {
    id: number;
    name: string;
}

export interface BoardRepository {
    getAll(): Promise<BoardAttributes[]>
}