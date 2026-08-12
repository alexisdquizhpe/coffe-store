import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProductByNameQuery } from "./get-product-by-name.query";
import { Inject, NotFoundException } from "@nestjs/common";
import { PRODUCT_REPOSITORY, type IProductRepository } from "src/modules/catalog/domain/repositories/product.repository.interface";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "src/modules/catalog/domain/repositories/category.repository.interface";

@QueryHandler(GetProductByNameQuery)
export class GetProductByNameHandler implements IQueryHandler<GetProductByNameQuery> {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(query: GetProductByNameQuery): Promise<{ id: string }> {
        const product = await this.productRepository.findByName(query.name);
        if (!product) throw new NotFoundException(`Product with name ${query.name} not found`);
        return { id: product.id };
    }
}