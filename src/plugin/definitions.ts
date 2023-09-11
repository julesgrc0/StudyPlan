
export type SessionDataObject = {
    session: string
}
export type CalendarDataObject = {
    data: string
}
export interface ApiPlugin {
    
    plugin_getCalendarData(data: object): Promise<CalendarDataObject | null>;
    plugin_getSession(data: object): Promise<SessionDataObject | null>;

    removeAllListeners(): Promise<void>;
}