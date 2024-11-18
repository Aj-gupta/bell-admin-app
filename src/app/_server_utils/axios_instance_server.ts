import axios from "axios";
import { cookies } from "next/headers";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_ENDPOINT
    : process.env.NEXT_PUBLIC_API_ENDPOINT;

const axiosinstanceserver = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosinstanceserver.interceptors.request.use(function (config) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  if (accessToken?.value) {
    config.headers.Authorization = `Bearer ${accessToken.value}`;
  }

  return config;
});

export default axiosinstanceserver;
