import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProductCommand } from "./update-product.command";
import { Inject } from "@nestjs/common";
import { type IProductRepository, PRODUCT_REPOSITORY } from "src/modules/catalog/domain/repositories/product.repository.interface";
import { CategoryNotFoundException, ProductNotFoundException } from "src/modules/catalog/domain/exceptions/catalog.exceptions";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "src/modules/catalog/domain/repositories/category.repository.interface";

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {

    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository
    ) { }

    async execute(command: UpdateProductCommand): Promise<{ id: string }> {

        const product = await this.productRepository.findById(command.id);
        if (!product)
            throw new ProductNotFoundException(command.id);

        if (command.categoryId) {
            const category = await this.categoryRepository.findById(command.categoryId);
            if (!category)
                throw new CategoryNotFoundException(command.categoryId);
        }

        product.updateDetails({
            categoryId: command.categoryId,
            name: command.name,
            description: command.description,
            price: command.price,
            imageUrl: command.imageUrl,
        })

        await this.productRepository.save(product);

        return { id: product.id };
    }

}