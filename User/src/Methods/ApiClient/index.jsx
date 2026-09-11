import axios from "axios";
import Environment from "../../Environemnt/script";
const baseUrl = Environment.api;
const getConfig = () => ({
    headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
    },
});
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};
const getApi = (url) => {
    return axios.get(
        `${baseUrl}${url}`,
        getConfig()
    );
}
const apimethods = {
    getApi,
}
export default apimethods;