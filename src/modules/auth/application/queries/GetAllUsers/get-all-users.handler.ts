import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllUsersQuery, PaginatedUsersResult } from "./get-all-users.query";
import { Inject } from "@nestjs/common";
import { ADMIN_USER_REPOSITORY, type IAdminUserRepository } from "src/modules/auth/domain/repositories/admin-user.repository.interface";

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
    constructor(
        @Inject(ADMIN_USER_REPOSITORY) private readonly adminUserRepository: IAdminUserRepository,
    ) { }

    async execute(query: GetAllUsersQuery): Promise<PaginatedUsersResult> {

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const result = await this.adminUserRepository.findAll(page, limit);

        const formatted = result.data.map(user => ({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }));

        return {
            data: formatted,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit
            }
        }

    }
}
