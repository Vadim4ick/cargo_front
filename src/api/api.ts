import { EnumTokens } from "@/const/const";
import { authServices } from "@/services/auth.service";
import type { CreateAxiosDefaults } from "axios";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const options: CreateAxiosDefaults = {
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
};

export const $api = axios.create(options);

export const $apiAuth = axios.create(options);

$apiAuth.interceptors.request.use((config) => {
  const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);

  if (config?.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

$apiAuth.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response.status === 401 ||
        error?.response?.data?.message === "jwt expired" ||
        error?.response?.data?.message === "Token has expired") &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        await authServices.refresh();

        return $apiAuth.request(originalRequest);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error?.response?.data?.message ===
              "The token has been blacklisted" ||
            error?.response?.data?.message === "jwt expired"
          ) {
            authServices.removeFromStorage();
            throw error;
          }
        }
      }
    }

    throw error;
  }
);
