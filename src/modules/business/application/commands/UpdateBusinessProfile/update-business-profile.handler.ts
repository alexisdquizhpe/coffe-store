import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BUSINESS_PROFILE_REPOSITORY, type IBusinessProfileRepository } from "src/modules/business/domain/repositories/business-profile.repository";
import { BusinessProfileNotFoundException } from "src/modules/business/domain/exceptions/business.exceptions";
import { UpdateBusinessProfileCommand } from "./update-business-profile.command";

@CommandHandler(UpdateBusinessProfileCommand)
export class UpdateBusinessProfileHandler implements ICommandHandler<UpdateBusinessProfileCommand> {

    constructor(
        @Inject(BUSINESS_PROFILE_REPOSITORY) private readonly profileRepository: IBusinessProfileRepository
    ) { }

    async execute(command: UpdateBusinessProfileCommand): Promise<{ id: string }> {
        const profile = await this.profileRepository.getProfile();
        if (!profile) throw new BusinessProfileNotFoundException();

        profile.updateDetails({
            name: command.name,
            slogan: command.slogan,
            phone: command.phone,
            address: command.address,
            email: command.email,
            website: command.website,
            logo: command.logo,
            favicon: command.favicon,
            services: command.services,
        });

        await this.profileRepository.save(profile);
        return { id: profile.id };
    }
}