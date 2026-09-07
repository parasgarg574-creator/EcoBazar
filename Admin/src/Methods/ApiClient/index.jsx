import axios from "axios";
import Environment from "../../Environment/script";
const baseUrl = Environment.api;
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};
const getConfig = () => ({
    headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
    },
});
const getImageConfig = () => ({
    headers: {
        ...getAuthHeaders(),
    },
});
const postApi = (url, payload) => {
    return axios.post(
        `${baseUrl}${url}`,
        payload,
        getConfig()
    );
};
const postImageApi = (url, payload) => {
    return axios.post(
        `${baseUrl}${url}`,
        payload,
        getImageConfig()
    );
};
const getApi = (url) => {
    return axios.get(
        `${baseUrl}${url}`,
        getConfig()
    );
};
const putApi = (url, payload) => {
    return axios.put(
        `${baseUrl}${url}`,
        payload,
        getConfig()
    );
};
const putImageApi = (url, payload) => {
    return axios.put(
        `${baseUrl}${url}`,
        payload,
        getImageConfig()
    );
};
const deleteApi = (url) => {
    return axios.delete(
        `${baseUrl}${url}`,
        getConfig()
    );
};
const apimethods = { postApi, getApi, postImageApi, putApi, putImageApi, deleteApi,
};
export default apimethods;
