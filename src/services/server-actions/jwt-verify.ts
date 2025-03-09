"use server";

import { jwtVerify } from "jose";

export interface ITokensInside {
  id: string;
  iat: number;
  exp: number;
}

const jwtVerifyServer = async (accessToken: string) => {
  try {
    const { payload }: { payload: ITokensInside } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('JWTExpired: "exp" claim timestamp check failed')
    ) {
      console.log("Токен истек");
      return null;
    }

    console.log("Ошибка валидации токена2");
    return null;
  }
};

export { jwtVerifyServer };
