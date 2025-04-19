import axios from "axios";

const baseURL =  'http://localhost:3000';

const axiosNodeInstance = axios.create({
    baseURL: baseURL
});

axiosNodeInstance.interceptors.request.use(
    function (config) {

        
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosNodeInstance.interceptors.response.use(
    (response) => {
        if (response.status === 401) {
            alert("You are not authorized");
        }
        return response;
    },
    (error) => {
        if (
            error.response &&
            error.response.data &&
            error.response.data.status === 401
        ) {
            console.log("You are not authorized",error.response && error.response.data);
            return Promise.reject(error.response && error.response.data);
        }
        return Promise.reject(error.response.data);
    }
);
export default axiosNodeInstance;