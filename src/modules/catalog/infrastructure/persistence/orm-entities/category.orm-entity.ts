import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class CategoryOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('int', { name: 'display_order' })
    displayOrder: number;

    @Column('boolean', { name: 'is_active', default: true })
    isActive: boolean;
}