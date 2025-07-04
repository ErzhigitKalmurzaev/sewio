import axios from "axios";
import { changetoken } from "./endSession";

export const API_DOMAIN = "194.31.52.244"
export const Base_URL = `http://${API_DOMAIN}`; // base

export const ImageUploadingFetch = axios.create({
  baseURL: Base_URL + "/api/v1/",
});
export const ImageUploadingChatFetch = axios.create({
  baseURL: Base_URL + "",
});
const axiosInstance = axios.create({
  baseURL: Base_URL + "/api/v1/",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async ({ response }) => {
    const refresh = localStorage.getItem("sewio_refresh_token");
    if (response?.status === 401 && refresh) {
      try {
        const { data } = await axios.post(`${Base_URL}/api/v1/token/refresh/`, {
          refresh: refresh,
        });
        localStorage.setItem("sewio_token", data.access);
        window.location.reload();
        return;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(
      (response && response.data) || "При запросе произошла ошибка"
    );
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("sewio_token");
    return {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "application/json",
        ...(!accessToken ? {} : { Authorization: `Bearer ${accessToken}` }),
      },
    };
  },
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

ImageUploadingFetch.interceptors.response.use(
  (response) => response,
  ({ response }) => {
    if (response?.status === 401) {
      // endSession();
    }
    return Promise.reject(
      (response && response.data) || "При запросе произошла ошибка"
    );
  }
);

ImageUploadingFetch.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("sewio_token");
    return {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
        ...(!accessToken ? {} : { Authorization: `Bearer ${accessToken}` }),
      },
    };
  },
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

ImageUploadingChatFetch.interceptors.response.use(
  (response) => response,
  ({ response }) => {
    if (response?.status === 401) {
      // endSession();
    }
    return Promise.reject(
      (response && response.data) || "При запросе произошла ошибка"
    );
  }
);

ImageUploadingChatFetch.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    return {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
        ...(!accessToken ? {} : { Authorization: `Bearer ${accessToken}` }),
      },
    };
  },
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);
export default axiosInstance;
