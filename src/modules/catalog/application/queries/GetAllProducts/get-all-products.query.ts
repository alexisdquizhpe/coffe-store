export class GetAllProductsQuery {
    constructor(
        public readonly page?: number,
        public readonly limit?: number,
    ) { }
}

export interface ProductListItem {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
}

export interface PaginatedProductsResult {
    data: ProductListItem[];
    pagination: { page: number; limit: number; total: number };
}