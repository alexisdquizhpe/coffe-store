import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { CategoryOrmEntity } from "./category.orm-entity";

@Entity('products')
export class ProductOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('uuid', { name: 'category_id' })
    categoryId: string;

    @ManyToOne(() => CategoryOrmEntity)
    @JoinColumn({ name: 'category_id' })
    category: CategoryOrmEntity;

    @Column('varchar')
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('boolean', { name: 'is_available', default: true })
    isAvailable: boolean;

    @Column('varchar', { name: 'image_url', nullable: true })
    imageUrl: string | null;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;

}