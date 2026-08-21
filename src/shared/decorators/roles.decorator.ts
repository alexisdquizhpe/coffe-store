import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('OWNER' | 'STAFF')[]) => SetMetadata(ROLES_KEY, roles);


// import { SetMetadata } from '@nestjs/common';
// import { type AdminRole } from 'src/modules/auth/domain/entities/admin-user.entity';

// export const ROLES_KEY = 'roles';
// export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
