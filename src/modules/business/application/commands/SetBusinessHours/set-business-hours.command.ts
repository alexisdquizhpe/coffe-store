import { DayOfWeek, TimeRange } from "src/modules/business/domain/entities/business-hours.entity";

export interface DayScheduleInput {
    dayOfWeek: DayOfWeek;
    ranges: TimeRange[]; // vacío = cerrado ese día
}

export class SetBusinessHoursCommand {
    constructor(
        public readonly schedule: DayScheduleInput[]
    ) { }
}
