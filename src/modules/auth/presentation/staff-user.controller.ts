import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Roles } from "src/shared/decorators/roles.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { RolesGuard } from "src/shared/guards/roles.guard";
import { RegisterStaffDto } from "./dtos/register-staff.dto";
import { CreateStaffUserCommand } from "../application/commands/CreateStaffUser/create-staff-user.command";
import { PaginationQuery } from "src/common/dto/pagination.dto";
import { GetAllUsersQuery } from "../application/queries/GetAllUsers/get-all-users.query";

@Controller('auth/staff')
export class StaffUserController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER')
    async register(@Body() dto: RegisterStaffDto) {
        return this.commandBus.execute(new CreateStaffUserCommand(
            dto.email,
            dto.password,
            dto.fullName
        ));
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER')
    async getAll(@Query() query: PaginationQuery) {
        return this.queryBus.execute(new GetAllUsersQuery(query.page, query.limit));
    }

}