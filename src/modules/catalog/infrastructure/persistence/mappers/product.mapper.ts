import { Product } from "src/modules/catalog/domain/entities/product.entity";
import { ProductOrmEntity } from "../orm-entities/product.orm-entity";

export class ProductMapper {
    static toDomain(orm: ProductOrmEntity): Product {
        return Product.fromPersistence({
            id: orm.id,
            categoryId: orm.categoryId,
            name: orm.name,
            description: orm.description,
            price: Number(orm.price),
            isAvailable: orm.isAvailable,
            imageUrl: orm.imageUrl,
        })
    }

    static toPersistence(domain: Product): ProductOrmEntity {
        const snapshot = domain.toSnapshot();
        const orm = new ProductOrmEntity();
        orm.id = snapshot.id;
        orm.categoryId = snapshot.categoryId;
        orm.name = snapshot.name;
        orm.description = snapshot.description;
        orm.price = snapshot.price;
        orm.isAvailable = snapshot.isAvailable;
        orm.imageUrl = snapshot.imageUrl;
        return orm;
    }
}