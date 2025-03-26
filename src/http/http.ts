import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    RequestEntityTooLargeException,
} from "./exceptions";
import { UnprocessableEntityException } from "@/http/exceptions";
import type { RequestMethod } from "./misc";
import { type IQueryMetadata, QueryMetadata } from "./query-metadata";
import type { Response } from "./response";

export class HttpClient {
    constructor(
        public base_url: string = "http://192.168.70.6",
        public refreshing = false,
        public options: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            mode: "no-cors",
        },
    ) {
        console.log("HTTP Client Constructed with base_url: ", base_url);
        console.log("HTTP refreshing token status: ", refreshing);
    }

    public async logout() {
        localStorage.removeItem("token");
    }

    public async login(credential: {
        username?: string;
        email?: string;
        password: string;
    }) {
        if (
            credential.username === undefined &&
            credential.email === undefined
        ) {
            throw new Error("Username or Email must be provided");
        }
        const response = await this.POST("/api/login", {
            body: JSON.stringify(credential),
        });
        // const response = await this.POST("/login", {
        //     body: JSON.stringify(credential),
        // });

        if (!response.success) {

            switch (response.code) {
                case 422:
                    throw new UnprocessableEntityException(response);
                default:
                    throw new Error("Unknown error");
            }
        }

        localStorage.setItem("token", JSON.stringify(response.data ?? "{}"));
    }

    // private async refresh_token(refresh_token: string): Promise<void> {
    //     this.refreshing = true;

    //     if (refresh_token) {
    //         // const response = await fetch(`${this.base_url}/refresh`, {
    //         //     method: "GET",
    //         //     headers: {
    //         //         "Content-Type": "application/json",
    //         //         Accept: "application/json",
    //         //         Authorization: `Bearer ${refresh_token}`,
    //         //     },
    //         // });
    //         const response = await fetch(`${this.base_url}/sso/refresh`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Accept: "application/json",
    //                 Authorization: `Bearer ${refresh_token}`,
    //             },
    //         });
    //         const data = await response.json();
    //         localStorage.setItem(
    //             "token",
    //             JSON.stringify({
    //                 access_token: data.data?.access_token,
    //                 refresh_token: data.data?.refresh_token,
    //             }),
    //         );
    //     }
    // }

    public async send(
        uri: string,
        method: RequestMethod,
        query?: IQueryMetadata,
        options?: RequestInit,
    ): Promise<Response> {
        console.log("HTTP Client send method called with uri: ", uri);
        const regex = new RegExp("^/");
        const queryParams = new QueryMetadata(query);
        const url =
            this.base_url +
            "/" +
            uri.replace(regex, "") +
            queryParams.toString();

        const access_token = JSON.parse(localStorage.getItem("token") ?? "null");

        if (access_token !== null) {
            this.options.headers = {
                ...this.options.headers,
                Authorization: `${access_token}`,
            };
        }

        const response = await fetch(url, {
            ...this.options,
            ...options,
            mode: "cors",
            method: method,
        });

        if (response.status === 401) {
            // localStorage.clear();
            // window.location.reload();
            return await response.json();
        }

        if (!response.ok) {
            const response_data = (await response.json()) as Response;
            switch (response_data.code) {
                case 401:
                    // When 401 encountered, prepare to refresh token
                    localStorage.clear();
                    return response_data;
                case 404:
                    throw new NotFoundException(response_data);
                case 409:
                    throw new ConflictException(response_data);
                case 413:
                    throw new RequestEntityTooLargeException(response_data);
                case 422:
                    throw new UnprocessableEntityException(response_data);
                case 500:
                    throw new InternalServerErrorException(response_data);
                default:
                    throw new Error(response_data.message);
            }
        } else {
            return response.json();
        }
    }

    async GET(
        uri: string,
        query?: IQueryMetadata,
        options?: RequestInit,
    ): Promise<Response> {
        return await this.send(uri, "GET", query, options);
    }

    async POST(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "POST", query, options);
    }

    async PATCH(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "PATCH", query, options);
    }

    async PATCH_WithAdminPassword(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        const admin_password = prompt("Admin Password");
        if (admin_password === null) {
            throw new Error("Admin Password is required");
        }
        return await this.send(
            uri,
            "PATCH",
            query,
            options ?? {
                headers: {
                    "Admin-Password": admin_password,
                },
            },
        );
    }

    async DELETE(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "DELETE", query, options);
    }

    async PUT(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "PUT", query, options);
    }
}
