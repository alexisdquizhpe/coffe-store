import { Category } from "src/modules/catalog/domain/entities/category.entity";
import { CategoryOrmEntity } from "../orm-entities/category.orm-entity";

export class CategoryMapper {

    static toDomain(orm: CategoryOrmEntity): Category {
        return Category.fromPersistence({
            id: orm.id,
            name: orm.name,
            displayOrder: orm.displayOrder,
            isActive: orm.isActive,
        });
    }

    static toPersistence(domain: Category): CategoryOrmEntity {
        const categoryOrm = new CategoryOrmEntity();
        categoryOrm.id = domain.id;
        categoryOrm.name = domain.name;
        categoryOrm.displayOrder = domain.displayOrder;
        categoryOrm.isActive = domain.isActive;
        return categoryOrm;
    }

}