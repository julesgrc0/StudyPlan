import { useState } from "react"


export const useLocalStorage = (key : string, initialValue: object) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (err) {
            return initialValue;
        }
    });

    const setValue = (value: object) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) { /* empty */ }
    };

    return [storedValue, setValue];
};