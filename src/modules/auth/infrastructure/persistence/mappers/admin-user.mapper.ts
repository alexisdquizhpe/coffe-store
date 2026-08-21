import { AdminRole, AdminUser } from "src/modules/auth/domain/entities/admin-user.entity";
import { AdminUserOrmEntity } from "../orm-entities/admin-user.orm-entity";

export class AdminUserMapper {

    static toDomain(ormEntity: AdminUserOrmEntity): AdminUser {
        return AdminUser.fromPersistence({
            id: ormEntity.id,
            email: ormEntity.email,
            passwordHash: ormEntity.passwordHash,
            fullName: ormEntity.fullName,
            role: ormEntity.role as AdminRole,
            isActive: ormEntity.isActive
        });
    }

    static toPersistence(domain: AdminUser): AdminUserOrmEntity {
        const orm = new AdminUserOrmEntity();
        orm.id = domain.id;
        orm.email = domain.email;
        orm.passwordHash = domain.passwordHash;
        orm.fullName = domain.fullName;
        orm.role = domain.role;
        orm.isActive = domain.isActive;
        return orm;
    }
}