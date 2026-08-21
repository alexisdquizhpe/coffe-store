import { RefreshToken } from "src/modules/auth/domain/entities/refresh-token.entity";
import { RefreshTokenOrmEntity } from "../orm-entities/refresh-token.orm-entity";

export class RefreshTokenMapper {
    static toDomain(orm: RefreshTokenOrmEntity): RefreshToken {
        return RefreshToken.fromPersistence({
            id: orm.id,
            userId: orm.adminUserId,
            tokenHash: orm.tokenHash,
            isRevoked: orm.isRevoked,
            expiresAt: orm.expiresAt,
            replacedByTokenId: orm.replacedByTokenId
        })
    }

    static toOrmEntity(domain: RefreshToken): RefreshTokenOrmEntity {
        const orm = new RefreshTokenOrmEntity();
        orm.id = domain.id;
        orm.adminUserId = domain.userId;
        orm.tokenHash = domain.tokenHash;
        orm.isRevoked = domain.isRevoked;
        orm.expiresAt = domain.expiresAt;
        orm.replacedByTokenId = domain.replacedByTokenId;
        return orm;
    }
}