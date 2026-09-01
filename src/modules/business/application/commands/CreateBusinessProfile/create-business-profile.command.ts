import { SocialLinkProps } from "src/modules/business/domain/entities/business-profile.entity";

export class CreateBusinessProfileCommand {
    constructor(
        public readonly name: string,
        public readonly phone: string,
        public readonly address: string,
        public readonly slogan?: string,
        public readonly email?: string | null,
        public readonly website?: string | null,
        public readonly logo?: string | null,
        public readonly favicon?: string | null,
        public readonly services?: string[],
        public readonly socialLinks?: SocialLinkProps[],
    ) { }
}