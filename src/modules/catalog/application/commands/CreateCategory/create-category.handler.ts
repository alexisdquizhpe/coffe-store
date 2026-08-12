import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCategoryCommand } from "./create-category.command";
import { Inject } from "@nestjs/common";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "src/modules/catalog/domain/repositories/category.repository.interface";
import { Category } from "src/modules/catalog/domain/entities/category.entity";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {

    constructor(
        @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository
    ) { }

    async execute(command: CreateCategoryCommand): Promise<{ id: string }> {
        const category = Category.create(
            command.name,
            command.displayOrder
        );

        await this.categoryRepository.save(category);

        return { id: category.id };
    }

}