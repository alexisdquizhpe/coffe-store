import { randomUUID } from "crypto";
import { InvalidPriceException, InvalidProductNameException } from "../exceptions/catalog.exceptions";

export interface ProductProps {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    imageUrl: string | null;
}

export class Product {

    private constructor(private props: ProductProps) { }

    static create(input: {
        categoryId: string;
        name: string;
        description: string;
        price: number;
        imageUrl?: string;
    }): Product {
        if (!input.name?.trim()) throw new InvalidProductNameException();
        if (input.price < 0) throw new InvalidPriceException(input.price);

        return new Product({
            id: randomUUID(),
            categoryId: input.categoryId,
            name: input.name.trim(),
            description: input.description,
            price: input.price,
            isAvailable: true,
            imageUrl: input.imageUrl ?? null,
        })
    }

    static fromPersistence(props: ProductProps): Product {
        return new Product(props);
    }

    get id() { return this.props.id; }
    get categoryId() { return this.props.categoryId; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get price() { return this.props.price; }
    get isAvailable() { return this.props.isAvailable; }
    get imageUrl() { return this.props.imageUrl; }

    updateDetails(input: { categoryId?: string; name?: string; description?: string; price?: number; imageUrl?: string }): void {
        if (input.price !== undefined && input.price <= 0) {
            throw new InvalidPriceException(input.price);
        }
        if (input.name !== undefined) {
            const name = input.name.trim();
            if (!name) throw new InvalidProductNameException();
            this.props.name = name;
        }
        if (input.description !== undefined) this.props.description = input.description.trim();
        if (input.price !== undefined) this.props.price = input.price;
        if (input.categoryId !== undefined) this.props.categoryId = input.categoryId;
        if (input.imageUrl !== undefined) this.props.imageUrl = input.imageUrl;
    }

    // Mensaje pensado para que el agente de IA lo pueda usar directamente en su respuesta al cliente
    toggleAvailability(available: boolean): void {
        this.props.isAvailable = available;
    }

    // auxiliar para persistencia
    toSnapshot(): ProductProps {
        return { ...this.props };
    }

}