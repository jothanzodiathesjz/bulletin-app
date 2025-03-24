import { Container } from "brandi";
import { TOKENS } from "./tokens";
import { HttpClient } from "./http/http";
import { AuthHttpRepository } from "./auth/data/Auth.repository";
import { PostRepositoryHttp } from "./post/data/Post.repository";
import { TagsHttpRepository } from "./tags/data/Tags.repository";
import { EmojiHttpRepository } from "./emoji/data/Emoji.repository";
import { BoardHttpRepository } from "./board/data/Board.repository";
import { UserHttpRepository } from "./users/data/User.repository";

const container = new Container();

container
    .bind(TOKENS.httpClientFactory)
    .toFactory(() => new HttpClient(import.meta.env.VITE_API_URL))
container
    .bind(TOKENS.httpClient)
    .toInstance(container.get(TOKENS.httpClientFactory))
    .inSingletonScope()
container
    .bind(TOKENS.authRepository)
    .toInstance(AuthHttpRepository)
    .inSingletonScope()
container
    .bind(TOKENS.PostRepository)
    .toInstance(PostRepositoryHttp)
    .inSingletonScope()
container
    .bind(TOKENS.TagsRepository)
    .toInstance(TagsHttpRepository)
    .inSingletonScope()
container
    .bind(TOKENS.EmojiRepository)
    .toInstance(EmojiHttpRepository)
    .inSingletonScope()
container
    .bind(TOKENS.BoardRepository)
    .toInstance(BoardHttpRepository)
    .inSingletonScope()
container
    .bind(TOKENS.UserRepository)
    .toInstance(UserHttpRepository)
    .inSingletonScope()
export default container