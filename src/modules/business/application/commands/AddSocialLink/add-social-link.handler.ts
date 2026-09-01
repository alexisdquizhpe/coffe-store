import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BUSINESS_PROFILE_REPOSITORY, type IBusinessProfileRepository } from "src/modules/business/domain/repositories/business-profile.repository";
import { BusinessProfileNotFoundException } from "src/modules/business/domain/exceptions/business.exceptions";
import { AddSocialLinkCommand } from "./add-social-link.command";

@CommandHandler(AddSocialLinkCommand)
export class AddSocialLinkHandler implements ICommandHandler<AddSocialLinkCommand> {

    constructor(
        @Inject(BUSINESS_PROFILE_REPOSITORY) private readonly profileRepository: IBusinessProfileRepository
    ) { }

    async execute(command: AddSocialLinkCommand): Promise<void> {
        const profile = await this.profileRepository.getProfile();
        if (!profile) throw new BusinessProfileNotFoundException();

        profile.addSocialLink({ type: command.type, url: command.url });
        await this.profileRepository.save(profile);
    }
}