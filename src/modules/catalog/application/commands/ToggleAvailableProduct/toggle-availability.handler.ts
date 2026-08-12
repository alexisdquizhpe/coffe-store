import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY, type IProductRepository } from "src/modules/catalog/domain/repositories/product.repository.interface";
import { ProductNotFoundException } from "src/modules/catalog/domain/exceptions/catalog.exceptions";
import { ToggleAvailabilityCommand } from "./toggle-availability.command";

@CommandHandler(ToggleAvailabilityCommand)
export class ToggleAvailabilityHandler implements ICommandHandler<ToggleAvailabilityCommand> {

    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository
    ) { }

    async execute(command: ToggleAvailabilityCommand): Promise<void> {
        const product = await this.productRepository.findById(command.productId);
        if (!product)
            throw new ProductNotFoundException(command.productId);

        product.toggleAvailability(command.available);
        await this.productRepository.save(product);
    }
}