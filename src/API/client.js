import axios from "axios";

export const BaseURL = 'https://crud-op-api-server.onrender.com/api/'

const client = axios.create({
    baseURL: BaseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default client;