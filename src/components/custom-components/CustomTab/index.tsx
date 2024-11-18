"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Tab {
  label: string;
  value: string;
}

interface Props {
  tabs: Tab[];
  defaultValue?: string;
  listClassName?: string;
  triggerClassName?: string;
  onChange: (value: Tab) => void;
}

export default function CustomTab({
  tabs,
  defaultValue,
  onChange,
  listClassName,
  triggerClassName,
}: Props) {
  const handleTabChange = (value: Tab) => {
    onChange(value);
  };

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList className={listClassName}>
        {tabs.map((tab) => (
          <TabsTrigger
            className={triggerClassName}
            key={tab.value}
            value={tab.value}
            onClick={() => handleTabChange(tab)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
