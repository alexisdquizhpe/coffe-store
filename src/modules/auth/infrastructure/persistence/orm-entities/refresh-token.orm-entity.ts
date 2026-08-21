import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AdminUserOrmEntity } from "./admin-user.orm-entity";

// Nota: sin soft delete a propósito — los tokens expirados se purgan
// físicamente vía cron job, ver TokenCleanupService (pendiente)

@Entity('refresh_tokens')
export class RefreshTokenOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('uuid', { name: 'admin_user_id' })
    adminUserId: string;

    @ManyToOne(() => AdminUserOrmEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'admin_user_id' })
    adminUser: AdminUserOrmEntity;

    @Column('varchar', {
        name: 'token_hash',
        unique: true,
        length: 64
    })
    tokenHash: string;

    @Column({
        name: 'is_revoked',
        default: false,
    })
    isRevoked: boolean;

    @Column({ name: 'expires_at' })
    expiresAt: Date;

    @Column('uuid', {
        name: 'replaced_by_token_id',
        nullable: true,
    })
    replacedByTokenId: string | null;
}
