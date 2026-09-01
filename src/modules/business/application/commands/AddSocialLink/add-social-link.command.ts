import { SocialLinkType } from "src/modules/business/domain/entities/business-profile.entity";

export class AddSocialLinkCommand {
    constructor(
        public readonly type: SocialLinkType,
        public readonly url: string,
    ) { }
}