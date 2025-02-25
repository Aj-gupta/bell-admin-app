"use client";

import { useMemo, useState } from "react";
import { getAPI, postAPI, patchAPI } from "@/lib/helper";
import { useRouter } from "next/navigation";
import { useUserDetail } from "@/lib/context/user_context/UserStateProvider";
import { SET_USER_DETAILS } from "@/lib/context/user_context/user.actiontype";
import { LOCAL_STORAGE_USER_DETAILS } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import CustomInput from "@/components/custom-components/CustomInput";
import { EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";

const Login = () => {
  const [_, dispatch] = useUserDetail();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      phone: formData.phone,
      password: formData.password,
      callbackUrl: "/users",
      redirect: false,
    });

    if (response?.status == 200) {
      try {
        const user = await getAPI("user", null);

        if (user.status == 200) {
          dispatch({ type: SET_USER_DETAILS, payload: user?.data?.data });

          localStorage.setItem(
            LOCAL_STORAGE_USER_DETAILS,
            JSON.stringify(user?.data?.data)
          );

          router.push("/users");
        }
      } catch (error) {
        console.log({ error });
      }
    } else {
      setErrorMessage(response?.error || "");
      return;
    }

    // Reset form fields
    setFormData({
      phone: "",
      password: "",
    });
  };

  const isButtonDisable = useMemo(() => {}, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-slate-50 bg-no-repeat bg-cover"
      style={{ backgroundImage: "url(/img/qqquad.svg)" }}
    >
      <div className="w-full max-w-md px-6 py-8 bg-white shadow-md rounded-lg border">
        <div className="flex items-center justify-center mb-4 gap-2">
          <Image src="/svg/logo.svg" height={57} width={57} alt="Bell" />
          <Link
            href="https://bellapp.co.in"
            target="_blank"
            className="text-black text-2xl font-bold"
          >
            Bell
          </Link>
        </div>
        <h2 className="mb-2 text-3xl font-semibold text-center">
          Welcome Back!
        </h2>
        {/* Welcome message */}
        <p className="mb-4 text-md text-center">Please sign in to continue.</p>
        {/* Instructional text */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block font-medium">
              Phone
            </label>

            <CustomInput
              id="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>

            <CustomInput
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              rightIcon={
                <span
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer"
                >
                  {passwordVisible ? <EyeNoneIcon /> : <EyeOpenIcon />}
                </span>
              }
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don`t have an account?{" "}
            <Link href="/register" className="text-black underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
