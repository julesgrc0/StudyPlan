
export interface ApiPlugin {
    plugin_getCalendarData(data: object): Promise<string | null>;
    plugin_getSession(data: object): Promise<string | null>;

    removeAllListeners(): Promise<void>;
}