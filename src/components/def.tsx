
export enum PageAnimationType {
    DEFAULT = "",
    REVERSE = "-rev",
    SPEED = "-sp",
}

export type CourseItem = {
    is_course: boolean;
    summary: string;
    location: string;
    description: string;
    time_info: string;
}

export type StorageData = {
    session: string | null;
    username: string | null;
    password: string | null;
    resourceId: number;
}

export const DEFAULT_STORAGE: StorageData = {
    session: null,
    username: null,
    password: null,
    resourceId: 0
}