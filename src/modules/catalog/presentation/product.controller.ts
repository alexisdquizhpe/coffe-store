import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetActiveMenuQuery } from '../application/queries/GetActiveMenu/get-active-menu.query';
import { CreateProductDto } from './dtos/create-product.dto';
import { ToggleAvailabilityDto } from './dtos/toggle-availability.dto';
import { CreateProductCommand } from '../application/commands/CreateProduct/create-product.command';
import { ToggleAvailabilityCommand } from '../application/commands/ToggleAvailableProduct/toggle-availability.command';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateProductCommand } from '../application/commands/UpdateProduct/update-product.command';
import { PaginationQuery } from 'src/common/dto/pagination.dto';
import { GetAllProductsQuery } from '../application/queries/GetAllProducts/get-all-products.query';

@Controller('catalog')
export class ProductController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }


    @Get('menu')
    async getMenu() {
        return await this.queryBus.execute(new GetActiveMenuQuery());
    }

    @Post('products')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('OWNER')
    async create(@Body() dto: CreateProductDto) {
        return await this.commandBus.execute(
            new CreateProductCommand(dto.categoryId, dto.name, dto.description ?? '', dto.price, dto.imageUrl),
        );
    }

    @Get('products')
    // @UseGuards(JwtAuthGuard)
    async getAll(@Query() query: PaginationQuery) {
        return await this.queryBus.execute(
            new GetAllProductsQuery(query.page, query.limit)
        )
    }

    @Patch('products/:id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
        return await this.commandBus.execute(
            new UpdateProductCommand(id, dto.categoryId, dto.name, dto.description, dto.price, dto.imageUrl)
        )
    }

    @Patch('products/:id/availability')
    // @UseGuards(JwtAuthGuard)
    async toggleAvailability(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ToggleAvailabilityDto) {
        await this.commandBus.execute(new ToggleAvailabilityCommand(id, dto.available));
        return { success: true };
    }
}
