import { ReactNode } from "react";

interface NavigationItemI {
  name: string;
  action?: () => void;
  isActive?: boolean;
  icon?: ReactNode;
}

export default function NavigationItem({
  name,
  action,
  isActive,
  icon,
}: NavigationItemI) {
  return (
    <div
      className={`flex items-center gap-2 p-2 w-full cursor-pointer hover:bg-slate-50 rounded ${
        isActive && "bg-slate-100"
      }`}
      onClick={action}
    >
      <div className="">{icon}</div>
      <p className="text-xs">{name}</p>
    </div>
  );
}
