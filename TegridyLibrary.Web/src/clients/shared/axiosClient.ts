import axios from 'axios';
import useApp from "@/hooks/useApp.ts";

const localApiUrl = "https://localhost:7001";
const productionApiUrl = window.location.origin;

export const apiUrl = import.meta.env.DEV ? localApiUrl : productionApiUrl;

export const axiosClient = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status == 401)
            useApp.getState().destroyLocalSession();

        return Promise.reject(error);
    }
);