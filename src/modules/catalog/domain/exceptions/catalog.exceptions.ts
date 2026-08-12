export class DomainException extends Error {
    constructor(message: string, public readonly code: string) {
        super(message);
    }
}

export class InvalidProductNameException extends DomainException {
    constructor() {
        super('El nombre del producto no puede estar vacío', 'INVALID_PRODUCT_NAME');
    }
}

export class InvalidPriceException extends DomainException {
    constructor(price: number) {
        super(`El precio debe ser mayor a 0, se recibió ${price}`, 'INVALID_PRICE');
    }
}

export class InvalidCategoryNameException extends DomainException {
    constructor() {
        super('El nombre de la categoría no puede estar vacío', 'INVALID_CATEGORY_NAME');
    }
}

export class ProductNotFoundException extends DomainException {
    constructor(identifier: string) {
        super(`Producto no encontrado: ${identifier}`, 'PRODUCT_NOT_FOUND');
    }
}

export class CategoryNotFoundException extends DomainException {
    constructor(identifier: string) {
        super(`Categoría no encontrada: ${identifier}`, 'CATEGORY_NOT_FOUND');
    }
}