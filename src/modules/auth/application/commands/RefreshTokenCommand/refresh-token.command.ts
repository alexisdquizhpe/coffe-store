export class RefreshTokenCommand {
    constructor(
        public readonly refreshTokenId: string,
        public readonly rawToken: string
    ) { }
}