export interface Response {
    success: boolean;
    code: number;
    message: string;
    data?: any; // can be undefined on some responses
    next_cursor?: string;
    token?: string;
    next_page?: string;
    previous_page?: string;
    per_page?: number;
    current_page?: number;
    total?: number
}
