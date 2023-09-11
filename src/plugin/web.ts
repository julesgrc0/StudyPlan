import { WebPlugin } from "@capacitor/core";
import type { ApiPlugin } from "./definitions";

export class ApiPluginWeb extends WebPlugin implements ApiPlugin {
    constructor() {
        super();
    }


    public plugin_getCalendarData(_data: object): Promise<string | null>
    {
        console.log(_data);
        return new Promise((res) => res(null));
    }

    public plugin_getSession(_data: object): Promise<string | null>
    {
        console.log(_data);
        return new Promise((res) => res(null));
    }
}