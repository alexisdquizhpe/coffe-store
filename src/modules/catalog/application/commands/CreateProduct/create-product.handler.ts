import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY, type IProductRepository } from "src/modules/catalog/domain/repositories/product.repository.interface";
import { Product } from "src/modules/catalog/domain/entities/product.entity";
import { CreateProductCommand } from "./create-product.command";


@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {

    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository
    ) { }

    async execute(command: CreateProductCommand): Promise<{ id: string }> {
        // La validación de negocio (precio > 0, nombre no vacío) vive en Product.create()
        const product = Product.create({
            categoryId: command.categoryId,
            name: command.name,
            description: command.description,
            price: command.price,
            imageUrl: command.imageUrl
        });

        await this.productRepository.save(product);

        return { id: product.id };
    }
}