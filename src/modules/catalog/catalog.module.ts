import { Module } from '@nestjs/common';
import { ProductController } from './presentation/product.controller';
import { CategoryController } from './presentation/category.controller';
import { GetActiveMenuHandler } from './application/queries/GetActiveMenu/get-active-menu.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/persistence/orm-entities/product.orm-entity';
import { CategoryOrmEntity } from './infrastructure/persistence/orm-entities/category.orm-entity';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.interface';
import { CreateProductCommand } from './application/commands/CreateProduct/create-product.command';
import { ToggleAvailabilityCommand } from './application/commands/ToggleAvailableProduct/toggle-availability.command';
import { CreateCategoryCommand } from './application/commands/CreateCategory/create-category.command';
import { UpdateCategoryCommand } from './application/commands/UpdateCategory/update-category.command';
import { UpdateProductCommand } from './application/commands/UpdateProduct/update-product.command';
import { GetAllCategoriesHandler } from './application/queries/GetAllCategories/get-all-categories.handler';
import { GetAllProductsHandler } from './application/queries/GetAllProducts/get-all-products.handler';
import { GetProductByNameHandler } from './application/queries/GetProductByNameQuery/get-product-by-name.handler';
import { CategoryRepositoty } from './infrastructure/repositories/category.repository';


const CommandHandlers = [CreateProductCommand, ToggleAvailabilityCommand, CreateCategoryCommand, UpdateCategoryCommand, UpdateProductCommand];
const QueryHandlers = [GetActiveMenuHandler, GetAllCategoriesHandler, GetAllProductsHandler, GetProductByNameHandler];


@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProductOrmEntity, CategoryOrmEntity])],
  controllers: [ProductController, CategoryController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepositoty },
    ...QueryHandlers,
    ...CommandHandlers
  ]
})
export class CatalogModule { }
