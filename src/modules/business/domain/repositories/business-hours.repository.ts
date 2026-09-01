import { BusinessHours, DayOfWeek } from "../entities/business-hours.entity";

export const BUSINESS_HOURS_REPOSITORY = Symbol('BUSINESS_HOURS_REPOSITORY');

export interface IBusinessHoursRepository {
    // Los 7 días se guardan juntos: al editar horarios desde el panel admin,
    // el caso de uso reemplaza la semana completa en una sola operación.
    saveAll(hours: BusinessHours[]): Promise<void>;
    findByDay(dayOfWeek: DayOfWeek): Promise<BusinessHours | null>;
    findAll(): Promise<BusinessHours[]>;
}