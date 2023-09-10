import { registerPlugin } from "@capacitor/core";
import type { ApiPlugin } from "./definitions";

const ApiPlugin = registerPlugin<ApiPlugin>("ApiPlugin", {
    web: () => import("./web").then((m) => new m.ApiPluginWeb()),
});

export * from "./definitions";
export { ApiPlugin };