import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BUSINESS_PROFILE_REPOSITORY, type IBusinessProfileRepository } from "src/modules/business/domain/repositories/business-profile.repository";
import { BusinessProfileNotFoundException } from "src/modules/business/domain/exceptions/business.exceptions";
import { RemoveSocialLinkCommand } from "./remove-social-link.command";

@CommandHandler(RemoveSocialLinkCommand)
export class RemoveSocialLinkHandler implements ICommandHandler<RemoveSocialLinkCommand> {

    constructor(
        @Inject(BUSINESS_PROFILE_REPOSITORY) private readonly profileRepository: IBusinessProfileRepository
    ) { }

    async execute(command: RemoveSocialLinkCommand): Promise<void> {
        const profile = await this.profileRepository.getProfile();
        if (!profile) throw new BusinessProfileNotFoundException();

        profile.removeSocialLink(command.type);
        await this.profileRepository.save(profile);
    }
}