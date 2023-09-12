import { useState } from "react"
import { StorageData } from "./def";



export const useLocalStorage = (key : string, initialValue: StorageData) => {
    const [storedValue, setStoredValue] = useState<StorageData>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (err) {
            return initialValue;
        }
    });

    const setValue = (value: StorageData) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) { /* empty */ }
    };

    return {
        storage: storedValue,
        setStorage: setValue
    };
};