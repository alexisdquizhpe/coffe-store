import { Inject, Injectable } from "@nestjs/common";
import { ICategoryRepository } from "../../domain/repositories/category.repository.interface";
import { CategoryOrmEntity } from "../persistence/orm-entities/category.orm-entity";
import { Repository } from "typeorm";
import { Category } from "../../domain/entities/category.entity";
import { CategoryMapper } from "../persistence/mappers/category.mapper";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoryRepositoty implements ICategoryRepository {

    constructor(
        @InjectRepository(CategoryOrmEntity) private readonly ormRepo: Repository<CategoryOrmEntity>,
    ) { }

    async save(category: Category): Promise<void> {
        const orm = CategoryMapper.toPersistence(category);
        await this.ormRepo.save(orm);
    }

    async findById(id: string): Promise<Category | null> {
        const orm = await this.ormRepo.findOneBy({ id });
        return orm ? CategoryMapper.toDomain(orm) : null;
    }

    async findAllActive(): Promise<Category[]> {
        const orms = await this.ormRepo.find({
            where: { isActive: true },
            order: { displayOrder: 'ASC' },
        });
        return orms.map((orm) => CategoryMapper.toDomain(orm));
    }

    async findAll(page: number, limit: number): Promise<{ data: Category[]; total: number; page: number; limit: number; }> {
        const [data, total] = await this.ormRepo.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
            order: { displayOrder: 'ASC' },
        });
        return { data: data.map((orm) => CategoryMapper.toDomain(orm)), total, page, limit };
    }
}