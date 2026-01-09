import type {StateCreator} from "zustand/vanilla";
import type LoginLibrarianRequestBody from "../clients/librarians/models/LoginLibrarianRequestBody.ts";
import librariansClient from "../clients/librarians/librariansClient.ts";
import type LibrarianDetailsReadModel from "../clients/librarians/models/LibrarianDetailsReadModel.ts";
import LibrarianPermissions from "../clients/librarians/models/LibrarianPermissions.ts";

interface PermissionsCache {
    canManageLibrarians: boolean,
    canManageReaders: boolean,
    canManageBooks: boolean,
    canManageBookLoans: boolean,
}

const defaultPermissionsCache: PermissionsCache = {
    canManageLibrarians: false,
    canManageReaders: false,
    canManageBooks: false,
    canManageBookLoans: false,
}

export interface AuthStorageSlice {
    librarian: LibrarianDetailsReadModel | null;
    permissionsCache: PermissionsCache,
    isLoggedIn(): boolean;
    login(credentials: LoginLibrarianRequestBody): Promise<void>;
    logout(): Promise<void>;
    destroyLocalSession(): void;
    verifyLocalSession(): Promise<void>;
}

export const createAuthStorageSlice: StateCreator<
    AuthStorageSlice,
    [],
    [],
    AuthStorageSlice
> = (set, get) => ({
    librarian: null,

    permissionsCache: defaultPermissionsCache,

    isLoggedIn() {
        return !!get().librarian;
    },

    async login(credentials) {
        const response = await librariansClient.login(credentials);
        const librarian = response.data!;
        set({ librarian, permissionsCache: createPermissionsCache(librarian) });
    },

    async logout() {
        await librariansClient.logout();
        get().destroyLocalSession();
    },

    destroyLocalSession() {
        set({ librarian: null, permissionsCache: defaultPermissionsCache });
    },

    async verifyLocalSession() {
        const response = await librariansClient.getCurrent();
        const librarian = response.data;
        set({ librarian, permissionsCache: createPermissionsCache(librarian) });
    },
});

function createPermissionsCache(librarian: LibrarianDetailsReadModel): PermissionsCache {
    return {
        canManageLibrarians: librarian.permissions.includes(LibrarianPermissions.ManageLibrarians),
        canManageReaders: librarian.permissions.includes(LibrarianPermissions.ManageReaders),
        canManageBooks: librarian.permissions.includes(LibrarianPermissions.ManageBooks),
        canManageBookLoans: librarian.permissions.includes(LibrarianPermissions.ManageBookLoans),
    };
}