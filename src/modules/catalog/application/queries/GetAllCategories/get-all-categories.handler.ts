import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllCategoriesQuery, PaginatedCategoriesResult } from "./get-all-categories.query";
import { Inject } from "@nestjs/common";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "src/modules/catalog/domain/repositories/category.repository.interface";

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler implements IQueryHandler<GetAllCategoriesQuery> {

    constructor(
        @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository
    ) { }

    async execute(query: GetAllCategoriesQuery): Promise<PaginatedCategoriesResult> {

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const result = await this.categoryRepository.findAll(page, limit);

        return {
            data: result.data.map(category => ({
                id: category.id,
                name: category.name,
                displayOrder: category.displayOrder,
                isActive: category.isActive,
            })),
            pagination: {
                page,
                limit,
                total: result.total,
            },
        };

    }
}