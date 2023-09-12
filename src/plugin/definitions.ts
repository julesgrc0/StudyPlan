
export type CalendarDataObject = {
    data: string
}
export interface ApiPlugin {
    
    plugin_getCalendarData(data: object): Promise<CalendarDataObject | null>;

    removeAllListeners(): Promise<void>;
}