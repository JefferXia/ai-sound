import NextAuth from "next-auth";

import { authConfig } from "@/app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
  matcher: ["/create/text", "/create/audio", "/create/video", "/login", "/register"],
};
