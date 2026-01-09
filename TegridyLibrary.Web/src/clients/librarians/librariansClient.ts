import {axiosClient} from "../shared/axiosClient.ts";
import type LoginLibrarianRequestBody from "./models/LoginLibrarianRequestBody.ts";
import type LibrarianDetailsReadModel from "./models/LibrarianDetailsReadModel.ts";
import type LibrarianTemporaryPasswordReadModel from "./models/LibrarianTemporaryPasswordReadModel.ts";
import type CreateLibrarianRequestBody from "./models/CreateLibrarianRequestBody.ts";
import type UpdateLibrarianRequestBody from "./models/UpdateLibrarianRequestBody.ts";
import type ChangeLibrarianPasswordRequestBody from "@/clients/librarians/models/ChangeLibrarianPasswordRequestBody.ts";

async function login(request: LoginLibrarianRequestBody) {
    return axiosClient.post<LibrarianDetailsReadModel>("/api/librarians/login", request);
}

async function getCurrent() {
    return axiosClient.get<LibrarianDetailsReadModel>("/api/librarians/current");
}

async function createLibrarian(request: CreateLibrarianRequestBody) {
    return axiosClient.post<LibrarianTemporaryPasswordReadModel>("/api/librarians/create", request);
}

async function updateLibrarian(librarianId: string, request: UpdateLibrarianRequestBody) {
    return axiosClient.put<LibrarianDetailsReadModel>(`/api/librarians/${librarianId}`, request);
}

async function deleteLibrarian(librarianId: string) {
    return axiosClient.delete<LibrarianDetailsReadModel>(`/api/librarians/${librarianId}`);
}

async function changePassword(request: ChangeLibrarianPasswordRequestBody) {
    return axiosClient.post(`/api/librarians/current/change-password`, request);
}

async function resetPassword(librarianId: string) {
    return axiosClient.post<LibrarianTemporaryPasswordReadModel>(`/api/librarians/${librarianId}/reset-password`);
}

async function logout() {
    return axiosClient.post(`/api/librarians/current/logout`);
}

async function getLibrarians() {
    return axiosClient.get<LibrarianDetailsReadModel[]>(`/api/librarians`);
}

const librariansClient = {
    login,
    getCurrent,
    createLibrarian,
    updateLibrarian,
    changePassword,
    logout,
    resetPassword,
    getLibrarians,
    deleteLibrarian
}

export default librariansClient;