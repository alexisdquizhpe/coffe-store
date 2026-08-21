import { RefreshToken } from "../entities/refresh-token.entity";

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface IRefreshTokenRepository {
    save(token: RefreshToken): Promise<void>;
    findById(id: string): Promise<RefreshToken | null>;
    revokeAllForUser(userid: string): Promise<void>;
}

