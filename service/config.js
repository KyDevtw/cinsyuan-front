import axios from "axios";

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  timeout: 60000,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("interceptors.request", error);
    return error;
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.log("interceptors.response", error);
    return error;
  }
);

export default instance;
