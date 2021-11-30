import axios from "axios";
import camelCase from "camelcase-keys";
import { API_URL } from "./config";

const axiosClient = axios.create({
    baseURL: `${API_URL}/api`,
    responseType: "json",
    timeout: 15 * 1000,
});

axiosClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => camelCase(response.data, { deep: true }),
    (error) => Promise.reject(error)
);

const getVoices = async () => {
    const response = await axiosClient({
        method: "GET",
        url: "voices",
    });
    return response;
};

const getSynthesisTeches = async () => {
    const response = await axiosClient({
        method: "GET",
        url: "/synthesis-techs",
    });
    return response;
};

const convertText = async (params) => {
    const response = await axiosClient({
        method: "GET",
        url: "/tts",
        params: params,
    });
    return response;
};

export { getVoices, getSynthesisTeches, convertText };
