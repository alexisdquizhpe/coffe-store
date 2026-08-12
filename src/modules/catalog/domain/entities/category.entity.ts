import { randomUUID } from "crypto";
import { InvalidCategoryNameException } from "../exceptions/catalog.exceptions";

export interface CategoryProps {
    id: string;
    name: string;
    displayOrder: number;
    isActive: boolean;
}

export class Category {

    private constructor(private props: CategoryProps) { }

    static create(name: string, displayOrder: number): Category {

        if (!name?.trim())
            throw new InvalidCategoryNameException();

        return new Category({
            id: randomUUID(),
            name: name.trim(),
            displayOrder: displayOrder,
            isActive: true,
        });
    }

    static fromPersistence(props: CategoryProps): Category {
        return new Category(props);
    }
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get displayOrder() { return this.props.displayOrder; }
    get isActive() { return this.props.isActive; }

    deactivate(): void {
        this.props.isActive = false;
    }

    updateDetails(name?: string, displayOrder?: number): void {

        if (name && !name.trim()) throw new InvalidCategoryNameException();
        if (name !== undefined) this.props.name = name.trim();
        if (displayOrder !== undefined) this.props.displayOrder = displayOrder;

    }

}