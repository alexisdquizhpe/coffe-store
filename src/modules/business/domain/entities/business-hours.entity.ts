import { randomUUID } from "crypto";
import { InvalidDayOfWeekException, InvalidTimeRangeException } from "../exceptions/business.exceptions";

// Sigue la convención de Date.getDay(): 0 = domingo ... 6 = sábado
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimeRange {
    open: string;  // formato "HH:mm", ej. "08:00"
    close: string; // formato "HH:mm", ej. "13:00"
}

export interface BusinessHoursProps {
    id: string;
    dayOfWeek: DayOfWeek;
    isClosed: boolean;
    ranges: TimeRange[]; // vacío si isClosed = true; puede tener 2+ para turnos partidos
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function validateRanges(ranges: TimeRange[]): void {
    const sorted = [...ranges].sort((a, b) => toMinutes(a.open) - toMinutes(b.open));

    for (let i = 0; i < sorted.length; i++) {
        const { open, close } = sorted[i];

        if (!TIME_REGEX.test(open) || !TIME_REGEX.test(close)) {
            throw new InvalidTimeRangeException(`formato esperado HH:mm, se recibió "${open}"-"${close}"`);
        }
        if (toMinutes(open) >= toMinutes(close)) {
            throw new InvalidTimeRangeException(`la apertura (${open}) debe ser antes del cierre (${close})`);
        }
        if (i > 0 && toMinutes(open) < toMinutes(sorted[i - 1].close)) {
            throw new InvalidTimeRangeException(`el turno ${open}-${close} se superpone con el anterior`);
        }
    }
}

export class BusinessHours {

    private constructor(private props: BusinessHoursProps) { }

    static create(dayOfWeek: DayOfWeek, ranges: TimeRange[]): BusinessHours {

        if (dayOfWeek < 0 || dayOfWeek > 6) throw new InvalidDayOfWeekException(dayOfWeek);

        const isClosed = ranges.length === 0;
        if (!isClosed) validateRanges(ranges);

        return new BusinessHours({
            id: randomUUID(),
            dayOfWeek,
            isClosed,
            ranges,
        });
    }

    static fromPersistence(props: BusinessHoursProps): BusinessHours {
        return new BusinessHours(props);
    }

    get id() { return this.props.id; }
    get dayOfWeek() { return this.props.dayOfWeek; }
    get isClosed() { return this.props.isClosed; }
    get ranges() { return this.props.ranges; }

    updateRanges(ranges: TimeRange[]): void {
        if (ranges.length > 0) validateRanges(ranges);
        this.props.ranges = ranges;
        this.props.isClosed = ranges.length === 0;
    }

    // ¿Este día, a esta hora (en minutos desde medianoche), el negocio está abierto?
    isOpenAt(minutesSinceMidnight: number): boolean {
        if (this.props.isClosed) return false;
        return this.props.ranges.some(
            (r) => minutesSinceMidnight >= toMinutes(r.open) && minutesSinceMidnight < toMinutes(r.close)
        );
    }

    // Próximo horario de apertura/cierre relevante a partir de esta hora, útil para el mensaje
    // "cierra a las X" / "reabre a las Y" que se muestra en el mockup.
    nextBoundaryAfter(minutesSinceMidnight: number): { type: 'closes' | 'opens'; time: string } | null {
        for (const range of this.props.ranges) {
            const open = toMinutes(range.open);
            const close = toMinutes(range.close);
            if (minutesSinceMidnight >= open && minutesSinceMidnight < close) {
                return { type: 'closes', time: range.close };
            }
            if (minutesSinceMidnight < open) {
                return { type: 'opens', time: range.open };
            }
        }
        return null;
    }

    toSnapshot(): BusinessHoursProps {
        return { ...this.props, ranges: this.props.ranges.map(r => ({ ...r })) };
    }
}