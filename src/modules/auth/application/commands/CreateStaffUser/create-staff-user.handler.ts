import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateStaffUserCommand } from "./create-staff-user.command";
import { Inject } from "@nestjs/common";
import { ADMIN_USER_REPOSITORY, type IAdminUserRepository } from "src/modules/auth/domain/repositories/admin-user.repository.interface";
import { AdminUserAlreadyExistsException } from "src/modules/auth/domain/execptions/auth.exceptions";
import { type IPasswordHasher, PASSWORD_HASHER } from "src/modules/auth/domain/services/password-hasher.interface";
import { AdminUser } from "src/modules/auth/domain/entities/admin-user.entity";
import { randomUUID } from "crypto";

@CommandHandler(CreateStaffUserCommand)
export class CreateStaffUserHandler implements ICommandHandler<CreateStaffUserCommand> {

    constructor(
        @Inject(ADMIN_USER_REPOSITORY) private readonly adminUserRepository: IAdminUserRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
    ) { }

    async execute(command: CreateStaffUserCommand): Promise<{ id: string }> {
        const adminUser = await this.adminUserRepository.findByEmail(command.email);
        if (adminUser)
            throw new AdminUserAlreadyExistsException(command.email);

        const hashedPassword = await this.passwordHasher.hash(command.password);
        const staffUser = AdminUser.create(
            command.email,
            hashedPassword,
            command.fullName,
            'STAFF'
        );
        await this.adminUserRepository.save(staffUser);

        return { id: staffUser.id };
    }

}