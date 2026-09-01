import { BusinessHours, DayOfWeek } from "../entities/business-hours.entity";

export interface BusinessStatus {
    isOpen: boolean;
    label: string; // ej. "Abierto · cierra a las 13:00" o "Cerrado · abre mañana a las 08:00"
}

// Ecuador continental no tiene horario de verano y está fijo en UTC-5 todo el año,
// así que Intl con esta timeZone es suficiente sin depender de una librería externa.
const BUSINESS_TIMEZONE = 'America/Guayaquil';

function getCurrentDayAndMinutes(now: Date): { dayOfWeek: DayOfWeek; minutes: number } {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: BUSINESS_TIMEZONE,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(now);

    const weekdayMap: Record<string, DayOfWeek> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };

    const weekday = parts.find(p => p.type === 'weekday')!.value;
    const hour = Number(parts.find(p => p.type === 'hour')!.value) % 24;
    const minute = Number(parts.find(p => p.type === 'minute')!.value);

    return { dayOfWeek: weekdayMap[weekday], minutes: hour * 60 + minute };
}

function formatMinutes(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const period = h >= 12 ? 'p.m.' : 'a.m.';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
}

export class BusinessStatusService {

    // `allHours` debe contener las 7 entradas (una por día). `now` es inyectable para poder
    // testear el cálculo sin depender del reloj real.
    static computeStatus(allHours: BusinessHours[], now: Date = new Date()): BusinessStatus {
        const { dayOfWeek, minutes } = getCurrentDayAndMinutes(now);
        const today = allHours.find(h => h.dayOfWeek === dayOfWeek);

        if (today && today.isOpenAt(minutes)) {
            const boundary = today.nextBoundaryAfter(minutes);
            const label = boundary
                ? `Abierto · cierra a las ${formatMinutes(toMinutesFromHHmm(boundary.time))}`
                : 'Abierto';
            return { isOpen: true, label };
        }

        // Cerrado ahora: busca la próxima apertura, hoy o en los próximos días.
        if (today) {
            const boundary = today.nextBoundaryAfter(minutes);
            if (boundary?.type === 'opens') {
                return {
                    isOpen: false,
                    label: `Cerrado · reabre a las ${formatMinutes(toMinutesFromHHmm(boundary.time))}`,
                };
            }
        }

        for (let offset = 1; offset <= 7; offset++) {
            const nextDay = ((dayOfWeek + offset) % 7) as DayOfWeek;
            const hours = allHours.find(h => h.dayOfWeek === nextDay);
            if (hours && !hours.isClosed && hours.ranges.length > 0) {
                const dayLabel = offset === 1 ? 'mañana' : DAY_NAMES[nextDay];
                return {
                    isOpen: false,
                    label: `Cerrado · abre ${dayLabel} a las ${formatMinutes(toMinutesFromHHmm(hours.ranges[0].open))}`,
                };
            }
        }

        return { isOpen: false, label: 'Cerrado' };
    }
}

const DAY_NAMES: Record<DayOfWeek, string> = {
    0: 'el domingo', 1: 'el lunes', 2: 'el martes', 3: 'el miércoles',
    4: 'el jueves', 5: 'el viernes', 6: 'el sábado',
};

function toMinutesFromHHmm(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}