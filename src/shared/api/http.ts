import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
    withCredentials: true, // важно, если у вас auth через cookies
});

// удобный лог ошибок
http.interceptors.response.use(
    (r) => r,
    (e) => {
        const msg = e?.response?.data?.message ?? e.message ?? "Request failed";
        console.error("API error:", msg, e?.response?.data);
        return Promise.reject(e);
    }
);