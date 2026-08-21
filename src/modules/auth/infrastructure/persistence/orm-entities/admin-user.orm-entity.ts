import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('admin_users')
export class AdminUserOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('varchar', {
        unique: true,
    })
    email: string;

    @Column('varchar', {
        name: 'password_hash'
    })
    passwordHash: string;

    @Column('varchar', {
        name: 'full_name'
    })
    fullName: string;

    @Column('varchar')
    role: string;

    @Column()
    isActive: boolean;
}