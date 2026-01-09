import type {StateCreator} from 'zustand';

export type ThemeMode = "light" | "dark";

export interface ThemeStorageSlice {
    themeMode: ThemeMode;
    setDarkMode: () => void;
    setLightMode: () => void;
    toggleColorMode: () => void;
}

export const createThemeStorageSlice: StateCreator<ThemeStorageSlice> = (set) => ({
    themeMode: getSystemThemeMode(),
    setDarkMode: () => {
        set({ themeMode: "dark" });
        updateUiTheme('dark')
    },
    setLightMode: () => {
        set({ themeMode: "light" });
        updateUiTheme('light')
    },
    toggleColorMode: () => {
        set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark'}))
    },
});

function getSystemThemeMode() : ThemeMode {
    const systemPrefersDark = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;

    return systemPrefersDark ? 'dark' : 'light';
}

export function updateUiTheme(mode: ThemeMode) {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
}