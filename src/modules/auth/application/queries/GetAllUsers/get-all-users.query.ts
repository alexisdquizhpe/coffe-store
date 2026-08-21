export class GetAllUsersQuery {
    constructor(
        public readonly page: number = 1,
        public readonly limit: number = 10
    ) { }
}

export type PaginatedUsersResult = {
    data: UserReadModel[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export type UserReadModel = {
    id: string;
    email: string;
    fullName: string;
    role: string;
}