export class ToggleAvailabilityCommand {
    constructor(
        public readonly productId: string,
        public readonly available: boolean,
    ) { }
}