import { Injectable } from "@nestjs/common";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductOrmEntity } from "../persistence/orm-entities/product.orm-entity";
import { Repository } from "typeorm";
import { Product } from "../../domain/entities/product.entity";
import { ProductMapper } from "../persistence/mappers/product.mapper";

@Injectable()
export class ProductRepository implements IProductRepository {

    constructor(
        @InjectRepository(ProductOrmEntity) private readonly ormRepo: Repository<ProductOrmEntity>,
    ) { }

    async save(product: Product): Promise<void> {
        const orm = ProductMapper.toPersistence(product);
        await this.ormRepo.save(orm);
    }

    async findById(id: string): Promise<Product | null> {
        const orm = await this.ormRepo.findOneBy({ id });
        return orm ? ProductMapper.toDomain(orm) : null;
    }

    async findByName(name: string): Promise<Product | null> {
        const orm = await this.ormRepo
            .createQueryBuilder('p')
            .where('p.name ILIKE :name', { name: `%${name}%` })
            .andWhere('p.deletedAt IS NULL')
            .getOne();
        return orm ? ProductMapper.toDomain(orm) : null;
    }

    async findAllAvailable(): Promise<Product[]> {
        const orms = await this.ormRepo.find({
            where: {
                isAvailable: true,
            },
            order: { name: 'ASC' },
        });
        return orms.map((orm) => ProductMapper.toDomain(orm));
    }

    async findAllByCategory(categoryId: string): Promise<Product[]> {
        const orms = await this.ormRepo.find({ where: { categoryId } });
        return orms.map((orm) => ProductMapper.toDomain(orm));
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Product[]; total: number; page: number; limit: number; }> {
        const [orms, total] = await this.ormRepo.findAndCount({
            order: { name: 'ASC' },
            skip: (page - 1) * limit,
            take: limit
        });

        return {
            data: orms.map(orm => ProductMapper.toDomain(orm)),
            total,
            page,
            limit
        };
    }

}