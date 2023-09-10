

export type CourseItem = {
    is_course: boolean;
    summary: string;
    location: string;
    description: string;
}

export type StorageData = {
    session: string | null;
    username: string | null;
    password: string | null;
}