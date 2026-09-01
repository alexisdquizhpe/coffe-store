import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BUSINESS_HOURS_REPOSITORY, type IBusinessHoursRepository } from "src/modules/business/domain/repositories/business-hours.repository";
import { BusinessHours } from "src/modules/business/domain/entities/business-hours.entity";
import { IncompleteWeeklyScheduleException } from "src/modules/business/domain/exceptions/business.exceptions";
import { SetBusinessHoursCommand } from "./set-business-hours.command";

@CommandHandler(SetBusinessHoursCommand)
export class SetBusinessHoursHandler implements ICommandHandler<SetBusinessHoursCommand> {

    constructor(
        @Inject(BUSINESS_HOURS_REPOSITORY) private readonly hoursRepository: IBusinessHoursRepository
    ) { }

    async execute(command: SetBusinessHoursCommand): Promise<void> {
        // Exigimos los 7 días explícitos (incluso si isClosed/ranges: []), para nunca
        // dejar un día "sin definir" que después el cálculo de estado interprete mal.
        const daysProvided = new Set(command.schedule.map(d => d.dayOfWeek));
        if (daysProvided.size !== 7) {
            throw new IncompleteWeeklyScheduleException();
        }

        const hours = command.schedule.map(day => BusinessHours.create(day.dayOfWeek, day.ranges));
        await this.hoursRepository.saveAll(hours);
    }
}