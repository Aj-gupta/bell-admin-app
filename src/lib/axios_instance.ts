import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_ENDPOINT
    : process.env.NEXT_PUBLIC_API_ENDPOINT;

console.log("Variable", process.env.NODE_ENV);
console.log("End point", process.env.NEXT_API_ENDPOINT);
console.log("End point public", process.env.NEXT_PUBLIC_API_ENDPOINT);
console.log("End point public", process.env.NEXT_PUBLIC_API_ENDPOINT2);
console.log("Next Auth", process.env.NEXTAUTH_URL);
console.log("Next Secret", process.env.NEXTAUTH_SECRET);

const axiosinstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosinstance.interceptors.request.use(async function (config) {
  const session = await getSession();
  const accessToken = session?.user?.accessToken;
  const refreshToken = session?.user?.refreshToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosinstance;
