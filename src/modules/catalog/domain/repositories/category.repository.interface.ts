import { Category } from "../entities/category.entity";

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
    save(category: Category): Promise<void>;
    findById(id: string): Promise<Category | null>;
    findAllActive(): Promise<Category[]>;
    findAll(page: number, limit: number): Promise<{ data: Category[]; total: number, page: number; limit: number }>;
}