import type { Response } from "./response";

export class UnprocessableEntityException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class InternalServerErrorException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class BadRequestException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class NotFoundException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class UnauthorizedException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class ConflictException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class RequestEntityTooLargeException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}
