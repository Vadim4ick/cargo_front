// protected-login.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerifyServer } from "./jwt-verify";
import { nextReddirect } from "./next-reddirect";
import { getTokensFromRequest } from "./get-tokens-from-req";

const protectedLogin = async (req: NextRequest) => {
  const tokens = await getTokensFromRequest(req);

  if (!tokens) return NextResponse.next();

  if (tokens?.accessToken) {
    const verifyData = await jwtVerifyServer(tokens.accessToken);

    if (!verifyData) {
      return NextResponse.next();
    }
  }
  return nextReddirect("/", req.url);
};

export { protectedLogin };
