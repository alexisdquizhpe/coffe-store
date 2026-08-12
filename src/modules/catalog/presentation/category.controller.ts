import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCategoryCommand } from '../application/commands/CreateCategory/create-category.command';
import { UpdateCategoryCommand } from '../application/commands/UpdateCategory/update-category.command';
import { GetAllCategoriesQuery } from '../application/queries/GetAllCategories/get-all-categories.query';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PaginationQuery } from 'src/common/dto/pagination.dto';

@Controller('categories')
export class CategoryController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }


    // POST /categories
    @Post()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('OWNER')
    async createCategory(@Body() dto: CreateCategoryDto) {
        const command = new CreateCategoryCommand(dto.name, dto.displayOrder);
        return await this.commandBus.execute(command);
    }

    // PUT /categories/:id
    @Patch(':id')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('OWNER')
    async updateCategory(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
        const command = new UpdateCategoryCommand(id, dto.name, dto.displayOrder);
        return await this.commandBus.execute(command);
    }

    // GET /category
    @Get()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('OWNER')
    async getAllCategories(@Query() query: PaginationQuery) {
        return await this.queryBus.execute(new GetAllCategoriesQuery(query.page, query.limit));
    }

}
