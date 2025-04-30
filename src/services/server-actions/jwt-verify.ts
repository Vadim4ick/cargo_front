"use server";

export interface ITokensInside {
  id: string;
  iat: number;
  exp: number;
}

const jwtVerifyServer = async (accessToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/validate-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-cache",
      }
    );

    const responseData = await res.json();
    // console.log("Ответ проверки токена:", responseData);

    if (responseData.message === "Token is valid") {
      return { valid: true };
    } else {
      return { valid: false, message: responseData.message };
    }
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
