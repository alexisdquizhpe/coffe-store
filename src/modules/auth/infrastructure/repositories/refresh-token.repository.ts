import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import { RefreshToken } from "../../domain/entities/refresh-token.entity";
import { RefreshTokenOrmEntity } from "../persistence/orm-entities/refresh-token.orm-entity";
import { RefreshTokenMapper } from "../persistence/mappers/refresh-token.mapper";


export class RefreshTokenRepository implements IRefreshTokenRepository {

    constructor(
        @InjectRepository(RefreshTokenOrmEntity) private readonly orm: Repository<RefreshTokenOrmEntity>
    ) { }

    async save(token: RefreshToken): Promise<void> {
        const orm = RefreshTokenMapper.toOrmEntity(token);
        await this.orm.save(orm);
    }

    async findById(id: string): Promise<RefreshToken | null> {
        const orm = await this.orm.findOneBy({ id });
        return orm ? RefreshTokenMapper.toDomain(orm) : null;
    }

    // Bulk update intencional para invalidar todos los tokens del usuario
    // para evitar el uso de múltiples tokens en el frontend
    async revokeAllForUser(userId: string): Promise<void> {
        await this.orm.update({ adminUserId: userId }, { isRevoked: true });
    }

}