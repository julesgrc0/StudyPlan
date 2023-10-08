import {
    CourseItem,
} from "./def";

import { LocalNotifications } from "@capacitor/local-notifications";
import "../styles/plan.scss";


export const IdDate = (date: Date): number => parseInt(`${date.getMonth() + 1}${date.getDate() + 1}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`)
export const IsTodayDate = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

export const createNotification = (item: CourseItem) => {
    if (item.time.getTime() < new Date().getTime()) {
        return;
    }

    LocalNotifications.schedule({
        notifications: [
            {
                title: item.summary,
                body: item.location,
                largeBody: item.location + "\n" + item.description,
                id: IdDate(item.time),
                schedule: {
                    at: item.time,
                    allowWhileIdle: true,
                },
            },
        ],
    })
};

export const removeNotification = (item: CourseItem | number) => {
    LocalNotifications.cancel({
        notifications: [
            {
                id: IdDate(typeof item == "number" ? new Date(item) : item.time),
            },
        ],
    })
};