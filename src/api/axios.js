import axios from "axios";

export const API_DOMAIN = "72.60.33.18"
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

// Флаг для предотвращения множественных запросов на обновление токена
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("sewio_refresh_token");
    
    if (error.response?.status === 401 && refresh && !originalRequest._retry) {
      if (isRefreshing) {
        // Если токен уже обновляется, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${Base_URL}/api/v1/token/refresh/`, {
          refresh: refresh,
        });
        
        const newAccessToken = data.access;
        localStorage.setItem("sewio_token", newAccessToken);
        
        // Обновляем заголовок Authorization для текущего запроса
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        
        // Повторяем оригинальный запрос с новым токеном
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Если обновление токена не удалось, очищаем localStorage
        localStorage.removeItem("sewio_token");
        localStorage.removeItem("sewio_refresh_token");
        
        // Можно добавить редирект на страницу логина
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(
      (error.response && error.response.data) || "При запросе произошла ошибка"
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
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("sewio_refresh_token");
    
    if (error.response?.status === 401 && refresh && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post(`${Base_URL}/api/v1/token/refresh/`, {
          refresh: refresh,
        });
        
        const newAccessToken = data.access;
        localStorage.setItem("sewio_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return ImageUploadingFetch(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("sewio_token");
        localStorage.removeItem("sewio_refresh_token");
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(
      (error.response && error.response.data) || "При запросе произошла ошибка"
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
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("sewio_refresh_token");
    
    if (error.response?.status === 401 && refresh && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post(`${Base_URL}/api/v1/token/refresh/`, {
          refresh: refresh,
        });
        
        const newAccessToken = data.access;
        localStorage.setItem("sewio_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return ImageUploadingChatFetch(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("sewio_token");
        localStorage.removeItem("sewio_refresh_token");
        window.location.load();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(
      (error.response && error.response.data) || "При запросе произошла ошибка"
    );
  }
);

ImageUploadingChatFetch.interceptors.request.use(
  (config) => {
    // Исправил ключ для получения токена - теперь используется sewio_token вместо accessToken
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

export default axiosInstance;