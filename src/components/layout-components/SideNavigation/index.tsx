"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SET_USER_DETAILS } from "@/lib/context/user_context/user.actiontype";
import { useUserDetail } from "@/lib/context/user_context/UserStateProvider";
import { ExitIcon } from "@radix-ui/react-icons";
import NavigationItem from "./components/NavigationItem";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SideNavigation({ list }: { list?: Array<any> }) {
  const [state, dispatch] = useUserDetail();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/login", redirect: true }).then(() => {
      dispatch({ type: SET_USER_DETAILS, payload: null });
      localStorage.clear();
    });
  };

  return (
    <Card className="p-4 rounded-lg h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="flex gap-2">
          <div className="w-1/5">
            <Avatar className="h-9 w-9">
              <AvatarImage src={state?.user_details?.avatar} />
              <AvatarFallback>{state?.user_details?.fullname}</AvatarFallback>
            </Avatar>
          </div>

          <div className="w-4/5 flex justify-between items-center ">
            <p className="text-sm">{state?.user_details?.username}</p>
            {/* <div className="p-1">
              <BellIcon className="text-slate-500" />
            </div> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grow flex flex-col gap-2 py-6 px-0">
        {list?.map((item, key) => (
          <NavigationItem
            key={key}
            isActive={pathname === item?.route}
            name={item?.name}
            action={() => {
              router.push(item?.route);
            }}
          />
        ))}
      </CardContent>
      <CardFooter className="flex flex-col p-0 gap-2">
        <NavigationItem
          icon={<ExitIcon />}
          name="Sign-out"
          action={handleLogout}
        />
      </CardFooter>
    </Card>
  );
}
