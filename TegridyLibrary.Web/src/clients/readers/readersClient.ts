import {axiosClient} from "@/clients/shared/axiosClient.ts";
import type CreateReaderRequestBody from "@/clients/readers/models/CreateReaderRequestBody.ts";
import type ReaderReadModel from "@/clients/readers/models/ReaderReadModel.ts";
import type UpdateReaderRequestBody from "@/clients/readers/models/UpdateReaderRequestBody.ts";

async function createReader(request: CreateReaderRequestBody) {
    return axiosClient.post<ReaderReadModel>(`/api/readers/create`, request);
}

async function updateReader(readerId: string, request: UpdateReaderRequestBody) {
    return axiosClient.put<ReaderReadModel>(`/api/readers/${readerId}`, request);
}

async function deleteReader(readerId: string) {
    return axiosClient.delete(`/api/readers/${readerId}`);
}

async function getReaders() {
    return axiosClient<ReaderReadModel[]>(`/api/readers`);
}

const readersClient = {
    createReader,
    updateReader,
    deleteReader,
    getReaders
}

export default readersClient;