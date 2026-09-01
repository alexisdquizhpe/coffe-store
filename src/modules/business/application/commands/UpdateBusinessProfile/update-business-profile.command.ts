export class UpdateBusinessProfileCommand {
    constructor(
        public readonly name?: string,
        public readonly slogan?: string,
        public readonly phone?: string,
        public readonly address?: string,
        public readonly email?: string | null,
        public readonly website?: string | null,
        public readonly logo?: string | null,
        public readonly favicon?: string | null,
        public readonly services?: string[],
    ) { }
}
