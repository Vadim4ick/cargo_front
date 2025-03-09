async function refresh(refreshToken?: string) {
  const { data } = await $api.post<{ access_token: string }>(
    `/auth/refresh`,
    {},
    {
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    }
  );
  return data;
}

import { EnumTokens } from "@/const/const";
import { AxiosError } from "axios";
import { type NextRequest } from "next/server";
import { $api } from "@/api/api";

const getTokensFromRequest = async (req: NextRequest) => {
  let accessToken = req.cookies.get(EnumTokens.ACCESS_TOKEN)?.value as string;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    req.cookies.delete(EnumTokens.ACCESS_TOKEN);
    return;
  }

  if (!accessToken) {
    try {
      const data = await refresh(refreshToken);

      if (!data) {
        return null;
      }
      // Используем новый токен из ответа
      accessToken = data.access_token;
    } catch (error) {
      if (error instanceof AxiosError && error.message === "invalid token") {
        console.log("Не валидный токен");
        req.cookies.delete(EnumTokens.ACCESS_TOKEN);
        return null;
      }
    }
  }
  return { accessToken };
};

export { getTokensFromRequest };
