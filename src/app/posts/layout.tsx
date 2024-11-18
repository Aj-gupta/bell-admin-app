"use client";

import SideNavigation from "@/components/layout-components/SideNavigation";
import { nav_items } from "./_lib/data";
import NavigationSheet from "@/app/_components/NavigationSheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserDetail } from "@/lib/context/user_context/UserStateProvider";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, dispatch] = useUserDetail();
  const [isMobileNavigationOpen, setIsNavigationOpen] = useState(false);

  const handleNavigationMenu = (value: boolean) => {
    setIsNavigationOpen(value);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row md:gap-4 md:p-8">
      <div className="hidden md:block w-1/6">
        <SideNavigation list={nav_items} />
      </div>

      <div className="md:hidden h-12 bg-white grid grid-cols-3 items-center px-4 py-2">
        <Avatar className="h-8 w-8" onClick={() => handleNavigationMenu(true)}>
          <AvatarImage src={state?.user_details?.avatar} />
          <AvatarFallback>{state?.user_details?.fullname}</AvatarFallback>
        </Avatar>
      </div>
      <Separator className="md:hidden" />
      <div className="w-full md:w-5/6 grow flex flex-col">{children}</div>

      <NavigationSheet
        visible={isMobileNavigationOpen}
        onChangeVisible={(value) => handleNavigationMenu(value)}
      >
        <SideNavigation list={nav_items} />
      </NavigationSheet>
    </div>
  );
}
