import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const api = axios.create({
  baseURL: "https://daisy.wisoft.io/yehwan/app1",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get("access_token");

    if (accessToken && !config.url.includes("/auth/refresh")) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];
let onLogout = null;

export const setLogoutHandler = (logoutFn) => {
  onLogout = logoutFn;
};

const processQueue = (err) => {
  failedQueue.forEach((prom) => {
    if (err) prom.reject(err);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(err);
    }

    if (
      err.response?.status === 401 &&
      err.response?.data?.errorCode === "TOKEN_EXPIRED"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("토큰 재발급을 시도합니다.");
        const refreshToken = cookies.get("refresh_token");
        const { data } = await api.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );
        const newAccessToken = data.access_token;
        cookies.set("access_token", newAccessToken, {
          path: "/",
          maxAge: 3600,
          sameSite: "None",
          secure: true,
        });

        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("토큰 재발급 실패:", refreshErr);
        processQueue(refreshErr, null);
        if (onLogout) onLogout();
        else alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  },
);

export default api;
