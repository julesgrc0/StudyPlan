// import * as ical from 'ical'

import { ApiPlugin } from '../plugin/index';
import { CourseItem } from './def';
export const LOGIN_URL = 'https://sso-cas.univ-rennes1.fr/login?service=https://ent.univ-rennes1.fr/Login'
export const CALENDAR_URL = 'https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp'
export const PROJECT_ID = 1;



 
// const getExecutionString = async (url: string) => {
//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             redirect: 'manual'
//         });

//         if (response.ok) {
//             const htmlContent = await response.text();
//             const regex = /name="execution"\s+value="([^"]+)"\s*/;
//             const match = htmlContent.match(regex);

//             if (match && match[1]) {
//                 return match[1];
//             }
//         }
//     } catch {
//         return null;
//     }
//     return null;
// }

// export const getFormatedDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`


// export const getSession = async (url: string, username: string, password: string) => {
//     const execution = await getExecutionString(url);
//     if (execution == null) return null;

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             body: new URLSearchParams({
//                 username,
//                 password,

//                 execution,
//                 _eventId: "submit",

//                 geolocation: ""
//             }),
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             // referrer: url,
//             redirect: 'manual'
//         });
//         alert(response.statusText)
//         const cookies = response.headers.getSetCookie().join(';');
//         return cookies.length > 0 ? cookies : null;
//     } catch (error) {
//         alert(error)
//         return null;
//     }
//     return null;
// }

// export const getCalendarRange = async (url: string, session: string, projectId: number, resourceId: number, startDate: Date, endDate: Date) => {
//     if (session == null) return null;

//     const objUrl = new URL(url);

//     objUrl.searchParams.set('resources', resourceId.toString());
//     objUrl.searchParams.set('projectId', projectId.toString());

//     objUrl.searchParams.set('calType', 'ical');

//     objUrl.searchParams.set('firstDate', getFormatedDate(startDate));
//     objUrl.searchParams.set('lastDate', getFormatedDate(endDate));

//     try {
//         const response = await fetch(objUrl.toString(), {
//             method: 'GET',
//             headers: {
//                 'Cookie': session,
//             }
//         });

//         if (response.ok) {
//             // const data = ical.parseICS(await response.text());

//             return [] as CourseItem[];
//         }
//     } catch {
//         return null;
//     }

//     return null;
// }

export const getSession = async (url: string, username: string, password: string) => {
    return await ApiPlugin.plugin_getSession({
        url, username, password
    })
}
export const getCalendarRange = async (url: string, session: string, projectId: number, resourceId: number, startDate: Date, endDate: Date) => {
    const data = await ApiPlugin.plugin_getCalendarData({
        url, session, projectId, resourceId, startDate:startDate.getTime(), endDate:endDate.getTime()
    })
    alert(data);
    return [] as CourseItem[];
}