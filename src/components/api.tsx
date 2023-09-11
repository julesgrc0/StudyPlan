// import * as ical from 'ical'

import { ApiPlugin } from '../plugin/index';
import { CourseItem } from './def';

export const LOGIN_URL = 'https://sso-cas.univ-rennes1.fr/login?service=https://ent.univ-rennes1.fr/Login'
export const CALENDAR_URL = 'https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp'
export const PROJECT_ID = 1;


export const getSession = async (url: string, username: string, password: string) => {
    return await ApiPlugin.plugin_getSession({
        url, username, password
    })
}

export const getCalendarRange = async (url: string, projectId: number, resourceId: number, startDate: Date, endDate: Date) => {
    const data = await ApiPlugin.plugin_getCalendarData({
        url, projectId, resourceId, startDate: startDate.toLocaleDateString('en-US'), endDate: endDate.toLocaleDateString('en-US')
    })
    alert(data);
    return [] as CourseItem[];
}