export class CreateCategoryCommand {
    constructor(
        public readonly name: string,
        public readonly displayOrder: number,
    ) { }
}