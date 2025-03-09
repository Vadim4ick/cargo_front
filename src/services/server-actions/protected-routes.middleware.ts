import { NextRequest, NextResponse } from "next/server";
import { jwtVerifyServer } from "./jwt-verify";
import { nextReddirect } from "./next-reddirect";
import { getTokensFromRequest } from "./get-tokens-from-req";

const protectedRoutes = async (req: NextRequest) => {
  const tokens = await getTokensFromRequest(req);

  // console.log(tokens);
  if (!tokens?.accessToken) {
    return nextReddirect("/login", req.url);
  }
  const verifyData = await jwtVerifyServer(tokens.accessToken);
  if (!verifyData) {
    return nextReddirect("/login", req.url);
  }
  return NextResponse.next();
};

export { protectedRoutes };
