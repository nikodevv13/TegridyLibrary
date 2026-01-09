import {axiosClient} from "../shared/axiosClient.ts";
import type GenreReadModel from "./models/GenreReadModel.ts";
import type CreateGenreRequestBody from "@/clients/genres/models/CreateGenreRequestBody.ts";
import type UpdateGenreRequestBody from "@/clients/genres/models/UpdateGenreRequestBody.ts";

async function getGenres() {
    return axiosClient.get<GenreReadModel[]>("/api/genres");
}

async function createGenre(request: CreateGenreRequestBody) {
    return axiosClient.post<GenreReadModel>(`/api/genres/create`, request);
}

async function updateGenre(genreId: string, request: UpdateGenreRequestBody) {
    return axiosClient.put<GenreReadModel>(`/api/genres/${genreId}`, request);
}

async function deleteGenre(genreId: string) {
    return axiosClient.delete(`/api/genres/${genreId}`);
}

const genresClient = {
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre
}

export default genresClient;