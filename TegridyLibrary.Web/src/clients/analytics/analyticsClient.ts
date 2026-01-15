import {axiosClient} from "@/clients/shared/axiosClient.ts";
import type GlobalAnalyticsReadModel from "@/clients/analytics/models/GlobalAnalyticsReadModel.ts";

async function getGlobalAnalytics() {
    return axiosClient.get<GlobalAnalyticsReadModel>(`/api/analytics/global`);
}

const analyticsClient = {
    getGlobalAnalytics
}

export default analyticsClient;