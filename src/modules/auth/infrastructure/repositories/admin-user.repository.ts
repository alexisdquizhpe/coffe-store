import { IAdminUserRepository } from "../../domain/repositories/admin-user.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminUserOrmEntity } from "../persistence/orm-entities/admin-user.orm-entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { AdminUser } from "../../domain/entities/admin-user.entity";
import { AdminUserMapper } from "../persistence/mappers/admin-user.mapper";

@Injectable()
export class AdminUserRepository implements IAdminUserRepository {
    constructor(@InjectRepository(AdminUserOrmEntity) private readonly ormRepo: Repository<AdminUserOrmEntity>) { }

    async save(user: AdminUser): Promise<void> {
        const orm = AdminUserMapper.toPersistence(user);
        await this.ormRepo.save(orm);
    }
    async findByEmail(email: string): Promise<AdminUser | null> {
        const orm = await this.ormRepo.findOneBy({ email });
        return orm ? AdminUserMapper.toDomain(orm) : null;
    }
    async findById(id: string): Promise<AdminUser | null> {
        const orm = await this.ormRepo.findOneBy({ id });
        return orm ? AdminUserMapper.toDomain(orm) : null;
    }
    async findAll(page: number, limit: number): Promise<{ data: AdminUser[]; total: number; page: number; limit: number; }> {
        const skip = (page - 1) * limit;
        const [data, total] = await this.ormRepo.findAndCount({
            skip,
            take: limit,
            order: {
                fullName: 'ASC'
            }
        });
        return {
            data: data.map(orm => AdminUserMapper.toDomain(orm)),
            total,
            page,
            limit,
        };
    }
}