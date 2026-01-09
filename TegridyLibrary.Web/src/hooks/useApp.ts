import {type AuthStorageSlice, createAuthStorageSlice} from "@/storage/AuthStorageSlice.ts";
import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import {createThemeStorageSlice, type ThemeStorageSlice, updateUiTheme} from "@/storage/ThemeStorageSlice.ts";

type AppStore = AuthStorageSlice & ThemeStorageSlice;

const useApp = create(
    persist<AppStore>(
        (...x) => ({
            ...createAuthStorageSlice(...x),
            ...createThemeStorageSlice(...x)
        }),
        {
            name: 'librarians-app-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const appState = useApp.getState();
appState.verifyLocalSession();

const currentTheme = appState.themeMode;
updateUiTheme(currentTheme);

export default useApp;

export const selectors = {
    librarians: {
        isLoggedId: (x: AppStore) => x.isLoggedIn(),
        current: (x: AppStore) => x.librarian,
        login: (x: AppStore) => x.login,
        logout: (x: AppStore) => x.logout,
        permissions: {
            canManageLibrarians: (x: AppStore) => x.permissionsCache.canManageLibrarians,
            canManageReaders: (x: AppStore) => x.permissionsCache.canManageReaders,
            canManageBooks: (x: AppStore) => x.permissionsCache.canManageBooks,
            canManageBookLoans: (x: AppStore) => x.permissionsCache.canManageBookLoans,
        },
    },
    theme: {
        mode: (x: AppStore) => x.themeMode,
        setDarkMode: (x: AppStore) => x.setDarkMode,
        setLightMode: (x: AppStore) => x.setLightMode,
    },
};