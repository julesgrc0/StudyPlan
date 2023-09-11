import * as ical from 'ical'

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

export const getCalendarRange = async (url: string, projectId: number, resourceId: number, startDate: Date, endDate: Date) => {
    let objData: CalendarDataObject | null = await ApiPlugin.plugin_getCalendarData({
        url, projectId, resourceId, startDate: startDate.toLocaleDateString('en-US'), endDate: endDate.toLocaleDateString('en-US')
    })

    let courses: CourseItem[] = [];
    if (objData == null) return courses;

    let data: string = objData.data;
    data = data.replace('\n', '<line>');
    
    try {

        const calendar: ical.FullCalendar = ical.parseICS(data);

        let next_start: Date = new Date();
        next_start.setHours(0, 0, 0, 0);

        Object.keys(calendar).map((uuid: string) => {
            const item: ical.CalendarComponent = calendar[uuid];


            if (!item.start || !item.end) {
                return;
            }

            if (next_start.getHours() !== 0 && next_start.getTime() != item.start.getTime()) {

                let diff = item.start.getHours() - next_start.getHours();
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

        if(next_start.getHours() !== 0)
        {
            let diff = 24 - next_start.getHours();
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
    } catch { }
    return courses;
}