import { Product } from "../entities/product.entity";

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface IProductRepository {
    save(product: Product): Promise<void>;
    findById(id: string): Promise<Product | null>;
    findByName(name: string): Promise<Product | null>; // clave para el agente ("¿tienen capuchino?")
    findAllAvailable(): Promise<Product[]>;
    findAllByCategory(categoryId: string): Promise<Product[]>;
    findAll(page?: number, limit?: number): Promise<{ data: Product[]; total: number; page: number; limit: number }>;
}