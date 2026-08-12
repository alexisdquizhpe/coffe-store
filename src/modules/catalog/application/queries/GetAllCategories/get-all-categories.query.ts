export class GetAllCategoriesQuery {
    constructor(
        public readonly page?: number,
        public readonly limit?: number,
    ) { }
}

export type PaginatedCategoriesResult = {
    data: CategoryReadModel[];
    pagination: { page: number; limit: number; total: number };
};

export interface CategoryReadModel {
    id: string;
    name: string;
    displayOrder: number;
    isActive: boolean;
}