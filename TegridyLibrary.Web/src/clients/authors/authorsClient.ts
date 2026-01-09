import {axiosClient} from "@/clients/shared/axiosClient.ts";
import type CreateAuthorRequestBody from "@/clients/authors/models/CreateAuthorRequestBody.ts";
import type AuthorReadModel from "@/clients/authors/models/AuthorReadModel.ts";
import type UpdateAuthorRequestBody from "@/clients/authors/models/UpdateAuthorRequestBody.ts";

async function createAuthor(request: CreateAuthorRequestBody) {
    return axiosClient.post<AuthorReadModel>(`/api/authors/create`, request);
}

async function updateAuthor(authorId: string, request: UpdateAuthorRequestBody) {
    return axiosClient.put<AuthorReadModel>(`/api/authors/${authorId}`, request);
}

async function deleteAuthor(authorId: string) {
    return axiosClient.delete(`/api/authors/${authorId}`);
}

async function getAuthors() {
    return axiosClient<AuthorReadModel[]>(`/api/authors`);
}

const authorsClient = {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getAuthors
}

export default authorsClient;