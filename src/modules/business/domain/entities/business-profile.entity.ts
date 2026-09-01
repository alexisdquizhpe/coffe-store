import {
    DuplicateSocialLinkException,
    InvalidAddressException,
    InvalidEmailException,
    InvalidNameException,
    InvalidPhoneException,
    InvalidUrlException,
} from "../exceptions/business.exceptions";

export enum SocialLinkType {
    FACEBOOK = "facebook",
    INSTAGRAM = "instagram",
    TWITTER = "twitter",
    YOUTUBE = "youtube",
    TIKTOK = "tiktok",
    LINKEDIN = "linkedin",
    WHATSAPP = "whatsapp",
    TELEGRAM = "telegram",
    OTHER = "other",
}

export interface SocialLinkProps {
    type: SocialLinkType;
    url: string;
}

export interface BusinessProfileProps {
    id: string;
    name: string;
    slogan: string;
    phone: string;
    address: string;
    email: string | null;
    website: string | null;
    logo: string | null;
    favicon: string | null;
    services: string[];
    socialLinks: SocialLinkProps[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

// Perfil del negocio: un solo registro existe en todo el sistema (singleton).
// Este id fijo evita el problema de "¿cuál fila es la buena?" al consultar,
// y evita depender de un findAll()[0] ambiguo.
const SINGLETON_ID = '00000000-0000-0000-0000-000000000001';

export class BusinessProfile {

    private constructor(private props: BusinessProfileProps) { }

    static readonly SINGLETON_ID = SINGLETON_ID;

    static create(params: {
        name: string;
        slogan?: string;
        phone: string;
        address: string;
        email?: string | null;
        website?: string | null;
        logo?: string | null;
        favicon?: string | null;
        services?: string[];
        socialLinks?: SocialLinkProps[];
    }): BusinessProfile {

        if (!params.name?.trim()) throw new InvalidNameException();
        if (!params.phone?.trim()) throw new InvalidPhoneException();
        if (!params.address?.trim()) throw new InvalidAddressException();
        if (params.email && !EMAIL_REGEX.test(params.email)) throw new InvalidEmailException(params.email);
        if (params.website && !isValidUrl(params.website)) throw new InvalidUrlException('website', params.website);

        const socialLinks = params.socialLinks ?? [];
        assertNoDuplicateSocialLinks(socialLinks);
        for (const link of socialLinks) {
            if (!isValidUrl(link.url)) throw new InvalidUrlException(link.type, link.url);
        }

        return new BusinessProfile({
            id: SINGLETON_ID,
            name: params.name.trim(),
            slogan: params.slogan?.trim() ?? '',
            phone: params.phone.trim(),
            address: params.address.trim(),
            email: params.email?.trim() ?? null,
            website: params.website?.trim() ?? null,
            logo: params.logo ?? null,
            favicon: params.favicon ?? null,
            services: (params.services ?? []).map(s => s.trim()).filter(Boolean),
            socialLinks,
        });
    }

    static fromPersistence(props: BusinessProfileProps): BusinessProfile {
        return new BusinessProfile(props);
    }

    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get slogan() { return this.props.slogan; }
    get phone() { return this.props.phone; }
    get address() { return this.props.address; }
    get email() { return this.props.email; }
    get website() { return this.props.website; }
    get logo() { return this.props.logo; }
    get favicon() { return this.props.favicon; }
    get services() { return this.props.services; }
    get socialLinks() { return this.props.socialLinks; }

    updateDetails(params: Partial<{
        name: string;
        slogan: string;
        phone: string;
        address: string;
        email: string | null;
        website: string | null;
        logo: string | null;
        favicon: string | null;
        services: string[];
    }>): void {

        if (params.name !== undefined) {
            if (!params.name.trim()) throw new InvalidNameException();
            this.props.name = params.name.trim();
        }
        if (params.slogan !== undefined) this.props.slogan = params.slogan.trim();

        if (params.phone !== undefined) {
            if (!params.phone.trim()) throw new InvalidPhoneException();
            this.props.phone = params.phone.trim();
        }

        if (params.address !== undefined) {
            if (!params.address.trim()) throw new InvalidAddressException();
            this.props.address = params.address.trim();
        }

        if (params.email !== undefined) {
            if (params.email && !EMAIL_REGEX.test(params.email)) throw new InvalidEmailException(params.email);
            this.props.email = params.email?.trim() || null;
        }

        if (params.website !== undefined) {
            if (params.website && !isValidUrl(params.website)) throw new InvalidUrlException('website', params.website);
            this.props.website = params.website?.trim() || null;
        }

        if (params.logo !== undefined) this.props.logo = params.logo;
        if (params.favicon !== undefined) this.props.favicon = params.favicon;
        if (params.services !== undefined) {
            this.props.services = params.services.map(s => s.trim()).filter(Boolean);
        }
    }

    // Un solo enlace por plataforma: si ya existe "facebook", hay que quitarlo primero.
    addSocialLink(link: SocialLinkProps): void {
        if (!isValidUrl(link.url)) throw new InvalidUrlException(link.type, link.url);
        if (this.props.socialLinks.some(l => l.type === link.type)) {
            throw new DuplicateSocialLinkException(link.type);
        }
        this.props.socialLinks = [...this.props.socialLinks, link];
    }

    removeSocialLink(type: SocialLinkType): void {
        this.props.socialLinks = this.props.socialLinks.filter(l => l.type !== type);
    }

    toSnapshot(): BusinessProfileProps {
        return {
            ...this.props,
            services: [...this.props.services],
            socialLinks: this.props.socialLinks.map(l => ({ ...l })),
        };
    }
}

function assertNoDuplicateSocialLinks(links: SocialLinkProps[]): void {
    const seen = new Set<SocialLinkType>();
    for (const link of links) {
        if (seen.has(link.type)) throw new DuplicateSocialLinkException(link.type);
        seen.add(link.type);
    }
}