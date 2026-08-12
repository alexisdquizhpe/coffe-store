import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllProductsQuery, PaginatedProductsResult } from "./get-all-products.query";
import { Inject } from "@nestjs/common";
import { type IProductRepository, PRODUCT_REPOSITORY } from "src/modules/catalog/domain/repositories/product.repository.interface";

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {

    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository
    ) { }

    async execute(query: GetAllProductsQuery): Promise<PaginatedProductsResult> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const products = await this.productRepository.findAll(page, limit);
        return {
            data: products.data.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                imageUrl: p.imageUrl,
                isAvailable: p.isAvailable,
            })),
            pagination: {
                page,
                limit,
                total: products.total,
            }
        };
    }
}