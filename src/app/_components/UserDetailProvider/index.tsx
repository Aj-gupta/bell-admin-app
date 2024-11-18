"use client";

import { UserDetailStateProvider } from "@/lib/context/user_context/UserStateProvider";
import reducer, { initialState } from "@/lib/context/user_context/user.reducer";

export default function UserDetailProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserDetailStateProvider initialState={initialState} reducer={reducer}>
      {children}
    </UserDetailStateProvider>
  );
}
