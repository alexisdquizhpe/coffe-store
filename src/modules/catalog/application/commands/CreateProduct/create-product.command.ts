export class CreateProductCommand {
    constructor(
        public readonly categoryId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly imageUrl?: string,
    ) { }
}