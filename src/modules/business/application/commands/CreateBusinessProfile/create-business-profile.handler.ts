import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BUSINESS_PROFILE_REPOSITORY, type IBusinessProfileRepository } from "src/modules/business/domain/repositories/business-profile.repository";
import { BusinessProfileAlreadyExistsException } from "src/modules/business/domain/exceptions/business.exceptions";
import { BusinessProfile } from "src/modules/business/domain/entities/business-profile.entity";
import { CreateBusinessProfileCommand } from "./create-business-profile.command";

@CommandHandler(CreateBusinessProfileCommand)
export class CreateBusinessProfileHandler implements ICommandHandler<CreateBusinessProfileCommand> {

    constructor(
        @Inject(BUSINESS_PROFILE_REPOSITORY) private readonly profileRepository: IBusinessProfileRepository
    ) { }

    async execute(command: CreateBusinessProfileCommand): Promise<{ id: string }> {
        const existing = await this.profileRepository.getProfile();
        if (existing) throw new BusinessProfileAlreadyExistsException();

        const profile = BusinessProfile.create({
            name: command.name,
            phone: command.phone,
            address: command.address,
            slogan: command.slogan,
            email: command.email,
            website: command.website,
            logo: command.logo,
            favicon: command.favicon,
            services: command.services,
            socialLinks: command.socialLinks,
        });

        await this.profileRepository.save(profile);
        return { id: profile.id };
    }
}