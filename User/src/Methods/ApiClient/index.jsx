import axios from "axios";
import Environment from "../../Environemnt/script";
const baseUrl = Environment.api;
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};
const getConfig = () => ({
    headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
    },
});
const getApi = (url) => {
    return axios.get(`${baseUrl}${url}`, getConfig());
};
const postApi = (url, data) => {
    return axios.post(`${baseUrl}${url}`, data, getConfig());
};
const apimethods = { getApi, postApi };
export default apimethods;