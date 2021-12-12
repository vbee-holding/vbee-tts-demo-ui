import axios from "axios";
import camelCase from "camelcase-keys";
import { API_URL } from "./config";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    responseType: "json",
    timeout: 15 * 1000,
});

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => camelCase(response.data, { deep: true }),
    (error) => Promise.reject(error)
);

const getVoices = async () => {
    const response = await api({
        method: "GET",
        url: "voices",
    });
    return response;
};

const getSynthesisTeches = async () => {
    const response = await api({
        method: "GET",
        url: "/synthesis-techs",
    });
    return response;
};

const createSynthesis = async (voice, inputText) => {
    const response = await api({
        method: "GET",
        url: "/synthesis",
        params: {
            voice: voice,
            input_text: inputText,
        },
    });
    return response;
};

export { getVoices, getSynthesisTeches, createSynthesis };
