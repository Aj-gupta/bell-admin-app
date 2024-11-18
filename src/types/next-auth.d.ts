import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    email?: string;
    fullname?: string;
    avatar?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      email?: string;
      fullname?: string;
      avatar?: string;
      role?: string;
      accessToken?: string;
      refreshToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    email?: string;
    fullname?: string;
    avatar?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
