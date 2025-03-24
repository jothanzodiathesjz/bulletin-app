import { token, type Factory } from "brandi";
import { HttpClient } from "./http/http";
import type { AuthRepository } from "./domain/Auth";
import type { PostRepository } from "./domain/Post";
import type { TagsRepository } from "./domain/Tags";
import type { EmojiRepository } from "./domain/Emoji";
import type { BoardRepository } from "./domain/Board";
import type { UserRepository } from "./domain/User";

export const TOKENS = {
    httpClientFactory: token<Factory<HttpClient>>('httpClientFactory'),
    httpClient: token<HttpClient>("httpClient"),
    authRepository: token<AuthRepository>('authRepository'),
    PostRepository: token<PostRepository>('PostRepository'),
    TagsRepository: token<TagsRepository>('TagsRepository'),
    EmojiRepository: token<EmojiRepository>('EmojiRepository'),
    BoardRepository: token<BoardRepository>('BoardRepository'),
    UserRepository: token<UserRepository>('UserRepository')
}