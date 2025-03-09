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

  //   async register({ email, inn }: { email: string; inn: string }) {
  //     const { data } = await $api.post<{
  //       message: string;
  //       data: { message: string; user_id: number };
  //     }>(`${this._Auth}/register`, { email, inn });

  //     return data;
  //   }

  private _saveTokenStorage(accessToken: string) {
    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
      domain: "localhost",
      sameSite: "Strict",
      expires: 300 / 86400,
      secure: true,
    });
  }

  removeFromStorage() {
    Cookies.remove(EnumTokens.ACCESS_TOKEN);
  }

  async logout() {
    await $apiAuth.post(`${this._Auth}/logout`);
    this.removeFromStorage();
  }

  //   async confirm({
  //     confirm_code,
  //     user_id,
  //   }: {
  //     confirm_code: string;
  //     user_id: string | number;
  //   }) {
  //     const { data } = await $api.post<{
  //       data: { access_token: string };
  //       message: string;
  //     }>(`${this._Auth}/confirm`, {
  //       confirm_code,
  //       user_id,
  //     });

  //     if (data?.data.access_token) {
  //       this._saveTokenStorage(data.data.access_token);
  //     }

  //     return data;
  //   }

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
