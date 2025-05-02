import { serverPostAPI } from "@/app/_server_utils/helper";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          let user;

          const response = await serverPostAPI("user/login", {
            phone: credentials.phone,
            password: credentials.password,
            login_type: "admin",
          });
          if (response?.status != 200) {
            throw new Error(response?.data?.message || "Invalid credentials");
          }
          user = {
            ...response?.data?.user,
            accessToken: response?.data?.token,
          };

          return user;
        } catch (error: any) {
          console.log({ error });
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token._id = user._id?.toString();
        token.name = user.username || user.name || user?.phone;
        token.phone = user.phone;
        token.fullname = user.fullname;
        token.avatar = user.avatar;
        token.role = user.role?.name;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.fullname = token.fullname;
        session.user.avatar = token.avatar;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
