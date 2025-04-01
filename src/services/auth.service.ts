import { $api, $apiAuth } from "@/api/api";
import { EnumTokens } from "@/const/const";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { User } from "./users.service";

class AuthServices {
  private _Auth = "/auth";

  async getMe() {
    const { data } = await $apiAuth.get<User>(`/profile`);

    return data;
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const { data } = await $api.post<{
        message: string;
        data: { access_token: string };
      }>(`${this._Auth}/login`, { email, password });

      if (data?.data?.access_token) {
        this._saveTokenStorage(data.data.access_token);
      }

      toast.success(data.message);

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          (error.response.data as { message?: string })?.message ||
            "Ошибка запроса"
        );
      } else {
        toast.error("Произошла непредвиденная ошибка");
      }
    }
  }

  async register({
    email,
    username,
    password,
    inviteToken,
  }: {
    username: string;
    email: string;
    password: string;
    inviteToken: string;
  }) {
    try {
      const { data } = await $api.post<{
        message: string;
        user: User;
      }>(`${this._Auth}/register`, { email, username, password, inviteToken });

      toast.success(data.message);

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          (error.response.data as { message?: string })?.message ||
            "Ошибка запроса"
        );
      } else {
        toast.error("Произошла непредвиденная ошибка");
      }
    }
  }

  private _saveTokenStorage(accessToken: string) {
    // Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
    //   domain: "localhost",
    //   sameSite: "Strict",
    //   expires: 300 / 86400,
    //   secure: true,
    // });
    // Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
    //   sameSite: "Strict",
    //   expires: 300 / 86400,
    //   secure: true,
    // });

    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
      secure: true,
      expires: 300 / 86400,
    });
  }

  removeFromStorage() {
    Cookies.remove(EnumTokens.ACCESS_TOKEN);
  }

  async logout() {
    await $apiAuth.post(`${this._Auth}/logout`);
    this.removeFromStorage();
  }

  async refresh(refreshToken?: string) {
    try {
      const { data } = await $api.post<{
        access_token: string;
      }>(
        `${this._Auth}/refresh`,
        {},
        {
          headers: {
            Cookie: `refreshToken ${refreshToken}`,
          },
        }
      );

      if (data?.access_token) {
        this._saveTokenStorage(data.access_token);
      }

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          (error.response.data as { message?: string })?.message ||
            "Ошибка запроса"
        );
      } else {
        toast.error("Произошла непредвиденная ошибка");
      }
    }
  }
}

export const authServices = new AuthServices();
