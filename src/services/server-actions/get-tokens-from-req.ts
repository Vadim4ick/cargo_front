async function refresh(refreshToken?: string) {
  const { data } = await $api.post<{ data: { access_token: string } }>(
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
  const cookieHeader = req.headers.get("cookie") || "";

  const getCookieValue = (key: string) => {
    const match = cookieHeader.match(new RegExp(`${key}=([^;]+)`));
    return match ? match[1] : undefined;
  };

  let accessToken = getCookieValue(EnumTokens.ACCESS_TOKEN);
  const refreshToken = getCookieValue("refresh_token");

  if (!refreshToken) {
    console.log("❌ refresh_token отсутствует");
    return null;
  }

  if (!accessToken) {
    try {
      const data = await refresh(refreshToken);
      if (!data) return null;

      accessToken = data?.data?.access_token;
    } catch (error) {
      if (error instanceof AxiosError && error.message === "invalid token") {
        console.log("⛔️ Невалидный refresh_token");
        return null;
      }
    }
  }

  return { accessToken };
};

export { getTokensFromRequest };
