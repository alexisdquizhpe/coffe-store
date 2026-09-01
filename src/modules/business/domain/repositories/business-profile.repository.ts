import { BusinessProfile } from "../entities/business-profile.entity";

export const BUSINESS_PROFILE_REPOSITORY = Symbol('BUSINESS_PROFILE_REPOSITORY');

export interface IBusinessProfileRepository {
    // save() actúa como upsert por PK (mismo comportamiento que TypeORM .save() ya usa
    // en el resto del proyecto) — como el id siempre es BusinessProfile.SINGLETON_ID,
    // esto crea la primera vez y actualiza las siguientes.
    save(profile: BusinessProfile): Promise<void>;
    getProfile(): Promise<BusinessProfile | null>;
}