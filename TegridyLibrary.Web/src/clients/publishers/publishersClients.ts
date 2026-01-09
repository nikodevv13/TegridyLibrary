import {axiosClient} from "../shared/axiosClient.ts";
import type PublisherReadModel from "./models/PublisherReadModel.ts";
import type CreatePublisherRequestBody from "@/clients/publishers/models/CreatePublisherRequestBody.ts";
import type UpdatePublisherRequestBody from "@/clients/publishers/models/UpdatePublisherRequestBody.ts";

async function getPublishers() {
    return axiosClient.get<PublisherReadModel[]>("/api/publishers");
}

async function createPublisher(request: CreatePublisherRequestBody) {
    return axiosClient.post<PublisherReadModel>(`/api/publishers/create`, request);

}
async function updatePublisher(publisherId: string, request: UpdatePublisherRequestBody) {
    return axiosClient.put<PublisherReadModel>(`/api/publishers/${publisherId}`, request);
}
async function deletePublisher(publisherId: string) {
    return axiosClient.delete(`/api/publishers/${publisherId}`);
}

const publishersClient = {
    getPublishers,
    createPublisher,
    updatePublisher,
    deletePublisher
}

export default publishersClient;