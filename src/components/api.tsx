import { CalendarComponent, FullCalendar } from '../lib/index';
import ical from '../lib/ical';

import { ApiPlugin, CalendarDataObject } from '../plugin/index';
import { CourseItem } from './def';

export const CALENDAR_URL = 'https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/cal.jsp'
export const PROJECT_ID = 1;



export const formateDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const getCalendarData = async (url: string, projectId: number, resourceId: number, date: Date) => {
    let objData: CalendarDataObject | null = await ApiPlugin.plugin_getCalendarData({
        url, projectId, resourceId, date: formateDate(date)
    })

    let courses: CourseItem[] = [];
    if (objData == null) return courses;

    let data: string = objData.data.replace('\n', '<line>');


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

            if (next_start.getHours() !== 0 && next_start.getTime() != item.start.getTime())
            {
                courses.push({
                    is_course: false,
                    summary: "",
                    location: "",
                    description: "",
                    time_info: "",
                    time: new Date()
                })
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
                time_info,
                time: item.start
            })
        })
    } catch { }
    return courses;
}