"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ReactNode } from "react";

export default function NavigationSheet({
  visible,
  onChangeVisible,
  children,
}: {
  visible: boolean;
  onChangeVisible: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Sheet open={visible} onOpenChange={onChangeVisible}>
      <SheetContent
        disableCloseButton={true}
        side={"left"}
        className="flex flex-col py-0 px-0 gap-0"
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
