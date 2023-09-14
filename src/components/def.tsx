
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
    time: Date;
}

export type StorageData = {
    notification: boolean;
    reminders: {
        [key: number]: boolean;
    };
    resourceId: number;
}

export type TreeItem = {
    [key: string]: TreeItem | number;
};

export const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
 

export const RESOURCE_ID_NONE: number = 0;

export const DEFAULT_STORAGE: StorageData = {
    notification: true,
    reminders: {},
    resourceId: RESOURCE_ID_NONE
}

export type HiddenStatProps = {
    children: string;
}

export type EditModalProps = {
    date: Date;
    open: boolean;
    resourceId: number;
    
    storage: StorageData;
    setStorage: (value: StorageData) => void;

    setOpen: (value: boolean) => void;
    setPath: (path: string, type: PageAnimationType) => void;
}

export type PlanProps = {
    storage: StorageData;
    setStorage: (value: StorageData) => void;

    setPath: (path: string, type: PageAnimationType) => void;
}

export type SelectionProps = {
    storage: StorageData;
    setStorage: (value: StorageData) => void;

    setPath: (path: string, type: PageAnimationType) => void;
};

export type TreeSelectionProps = {
    tree: TreeItem;
    resourceId: number;
    setResourceId: (id: number) => void;
};


