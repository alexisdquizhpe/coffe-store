import { Inject } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { BUSINESS_PROFILE_REPOSITORY, type IBusinessProfileRepository } from "src/modules/business/domain/repositories/business-profile.repository";
import { BUSINESS_HOURS_REPOSITORY, type IBusinessHoursRepository } from "src/modules/business/domain/repositories/business-hours.repository";
import { BusinessProfileNotFoundException } from "src/modules/business/domain/exceptions/business.exceptions";
import { BusinessStatusService } from "src/modules/business/domain/services/business-status.service";
import { GetBusinessInfoQuery } from "./get-business-info.query";

export interface BusinessInfoReadModel {
    profile: {
        name: string;
        slogan: string;
        phone: string;
        address: string;
        email: string | null;
        website: string | null;
        logo: string | null;
        services: string[];
        socialLinks: { type: string; url: string }[];
    };
    hours: {
        dayOfWeek: number;
        isClosed: boolean;
        ranges: { open: string; close: string }[];
    }[];
    status: {
        isOpen: boolean;
        label: string;
    };
}

@QueryHandler(GetBusinessInfoQuery)
export class GetBusinessInfoHandler implements IQueryHandler<GetBusinessInfoQuery> {

    constructor(
        @Inject(BUSINESS_PROFILE_REPOSITORY) private readonly profileRepository: IBusinessProfileRepository,
        @Inject(BUSINESS_HOURS_REPOSITORY) private readonly hoursRepository: IBusinessHoursRepository,
    ) { }

    async execute(): Promise<BusinessInfoReadModel> {
        const profile = await this.profileRepository.getProfile();
        if (!profile) throw new BusinessProfileNotFoundException();

        const hours = await this.hoursRepository.findAll();
        const status = BusinessStatusService.computeStatus(hours);

        return {
            profile: {
                name: profile.name,
                slogan: profile.slogan,
                phone: profile.phone,
                address: profile.address,
                email: profile.email,
                website: profile.website,
                logo: profile.logo,
                services: profile.services,
                socialLinks: profile.socialLinks,
            },
            hours: hours
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map(h => ({ dayOfWeek: h.dayOfWeek, isClosed: h.isClosed, ranges: h.ranges })),
            status,
        };
    }
}