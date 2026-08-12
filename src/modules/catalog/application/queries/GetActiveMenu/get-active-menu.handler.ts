import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetActiveMenuQuery } from "./get-active-menu.query";
import { Inject } from "@nestjs/common";
import { type IProductRepository, PRODUCT_REPOSITORY } from "src/modules/catalog/domain/repositories/product.repository.interface";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "src/modules/catalog/domain/repositories/category.repository.interface";

export interface MenuCategoryReadModel {
    categoryId: string;
    categoryName: string;
    products: { id: string; name: string; description: string; price: number; imageUrl: string | null }[];
}

@QueryHandler(GetActiveMenuQuery)
export class GetActiveMenuHandler implements IQueryHandler<GetActiveMenuQuery> {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(): Promise<MenuCategoryReadModel[]> {

        const [categories, products] = await Promise.all([
            this.categoryRepository.findAllActive(),
            this.productRepository.findAllAvailable()
        ]);

        return categories
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((category) => ({
                categoryId: category.id,
                categoryName: category.name,
                products: products
                    .filter(p => p.categoryId === category.id)
                    .map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        imageUrl: p.imageUrl,
                    }))
            }));

    }
}