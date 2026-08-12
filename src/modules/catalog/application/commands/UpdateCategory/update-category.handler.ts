import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "src/modules/catalog/domain/repositories/category.repository.interface";
import { CategoryNotFoundException } from "src/modules/catalog/domain/exceptions/catalog.exceptions";
import { UpdateCategoryCommand } from "./update-category.command";

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {

    constructor(
        @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository
    ) { }

    async execute(command: UpdateCategoryCommand): Promise<{ id: string }> {
        const category = await this.categoryRepository.findById(command.id);
        if (!category) throw new CategoryNotFoundException(command.id);

        category.updateDetails(command.name, command.displayOrder);
        await this.categoryRepository.save(category);
        return { id: category.id };
    }

}