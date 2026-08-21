import { AdminUser } from "../entities/admin-user.entity";

export const ADMIN_USER_REPOSITORY = Symbol('ADMIN_USER_REPOSITORY');

export interface IAdminUserRepository {
    save(user: AdminUser): Promise<void>;
    findByEmail(email: string): Promise<AdminUser | null>;
    findById(id: string): Promise<AdminUser | null>;
    findAll(page: number, limit: number): Promise<{ data: AdminUser[]; total: number, page: number; limit: number }>;
}