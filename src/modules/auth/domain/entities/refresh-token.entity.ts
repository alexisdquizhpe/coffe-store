import { randomUUID } from "crypto";

export interface RefreshTokenProps {
    id: string;
    userId: string;
    tokenHash: string;
    isRevoked: boolean;
    expiresAt: Date;
    replacedByTokenId: string | null;
}

export class RefreshToken {

    private constructor(private props: RefreshTokenProps) { }

    static create(userId: string, tokenHash: string, ttlDays = 7): RefreshToken {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + ttlDays);

        return new RefreshToken({
            id: randomUUID(),
            userId,
            tokenHash,
            isRevoked: false,
            expiresAt,
            replacedByTokenId: null
        });
    }

    static fromPersistence(props: RefreshTokenProps): RefreshToken {
        return new RefreshToken(props);
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get tokenHash(): string {
        return this.props.tokenHash;
    }

    get isRevoked(): boolean {
        return this.props.isRevoked;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get replacedByTokenId(): string | null {
        return this.props.replacedByTokenId;
    }

    isExpired(): boolean {
        return this.props.expiresAt.getTime() < Date.now();
    }

    isValid(): boolean {
        return !this.props.isRevoked && !this.isExpired();
    }

    revoke(replacedByTokenId?: string): void {
        this.props.isRevoked = true;
        if (replacedByTokenId) this.props.replacedByTokenId = replacedByTokenId;
    }
}