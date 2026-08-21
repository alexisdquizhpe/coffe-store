import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('categories')
export class CategoryOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column('int', { name: 'display_order' })
    displayOrder: number;

    @Column('boolean', { name: 'is_active', default: true })
    isActive: boolean;
}