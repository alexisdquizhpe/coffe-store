import { SocialLinkType } from "src/modules/business/domain/entities/business-profile.entity";

export class RemoveSocialLinkCommand {
    constructor(
        public readonly type: SocialLinkType,
    ) { }
}