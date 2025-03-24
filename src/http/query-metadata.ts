export interface IQueryMetadata {
    search?: string;
    sort_by?: string;
    sort?: "asc" | "desc";
    cursor?: string;
    start_date?: string;
    end_date?: string;
    date?: string;
    page?: string;
    title?: string;
    start?: string;
    end?: string;
}

export class QueryMetadata {
    constructor(
        query?: IQueryMetadata,
        private params: URLSearchParams = new URLSearchParams(),
    ) {
        if (query?.search) this.params.set("search", query.search);

        if (query?.sort) this.params.set("sort", query.sort);

        if (query?.sort_by) this.params.set("sort_by", query.sort_by);

        if (query?.cursor) this.params.set("cursor", query.cursor);

        if (query?.start_date) this.params.set("start_date", query.start_date);

        if (query?.end_date) this.params.set("end_date", query.end_date);

        if (query?.date) this.params.set("date", query.date);

        if (query?.page) this.params.set("page", query.page);

        if (query?.title) this.params.set("title", query.title);

        if (query?.start) this.params.set("start", query.start);

        if (query?.end) this.params.set("end", query.end)
    }

    toString(): string {
        if (this.params.toString() === "") return "";

        return "?" + this.params.toString();
    }
}
