import { CalendarComponent, FullCalendar } from '../lib/index';
import ical from '../lib/ical';

import { ApiPlugin, CalendarDataObject, SessionDataObject } from '../plugin/index';
import { CourseItem } from './def';

export const LOGIN_URL = 'https://sso-cas.univ-rennes1.fr/login?service=https://ent.univ-rennes1.fr/Login'
export const CALENDAR_URL = 'https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp'
export const PROJECT_ID = 1;


export const getSession = async (url: string, username: string, password: string) => {
    let session: SessionDataObject | null = await ApiPlugin.plugin_getSession({
        url, username, password
    })
    return session?.session ?? null;
}

export const formateDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const getCalendarData = async (url: string, projectId: number, resourceId: number, date: Date) => {
    let objData: CalendarDataObject | null = await ApiPlugin.plugin_getCalendarData({
        url, projectId, resourceId, date: formateDate(date)
    })

    let courses: CourseItem[] = [];
    if (objData == null) return courses;

    let data: string = objData.data.replace('\n', '<line>');

    const fillFreeTime = (date0: Date | number, date1: Date | number ) =>
    {
        let diff = (typeof date0 == "number" ? date0 : date0.getHours()) - (typeof date1 == "number" ? date1 : date1.getHours());
        for (let i = 0; i < diff; i++) {
            courses.push({
                is_course: false,
                summary: "",
                location: "",
                description: "",
                time_info: ""
            })
        }
    }

    try {

        let calendar_data: FullCalendar = ical.parseICS(data);
        let calendar_items: CalendarComponent[] = [];

        Object.keys(calendar_data).map(item => calendar_items.push(calendar_data[item]));
        
        calendar_items = calendar_items.sort((a, b)=> {
            if (!a.start || !b.start) {
                return 0;
            }
            return a.start?.getTime() - b.start?.getTime();
        })


        let next_start: Date = new Date();
        next_start.setHours(0, 0, 0, 0);

        calendar_items.map(item => {
            if (!item.start || !item.end)
            {
                return;
            }

            if (next_start.getHours() !== 0 && next_start.getTime() != item.start.getTime()) {

                fillFreeTime(item.start, next_start)
            }

            let time_info = "";

            time_info += item.start.getHours() + "h";
            if (item.start.getMinutes() != 0) {
                time_info += item.start.getMinutes();
            }
            time_info += " - ";
            time_info += item.end.getHours() + "h";
            if (item.end.getMinutes() != 0) {
                time_info += item.end.getMinutes();
            }

            next_start = item.start;


            courses.push({
                is_course: true,
                summary: item.summary ?? "",
                location: item.location ?? "",
                description: item.description ?? "",
                time_info
            })
        })

        fillFreeTime(24, next_start);
    } catch { }
    return courses;
}