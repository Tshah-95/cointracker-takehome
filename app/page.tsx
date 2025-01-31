"use client";

import {
  ChartLine,
  Coins,
  Copyright,
  Crosshair,
  Hammer,
  HandCoins,
  Receipt,
  Wallet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("wallet");

  return (
    <div className="flex justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="bg-neutral-100 flex flex-col xl:flex-row w-full h-full min-h-screen">
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="flex flex-col flex-1 w-full gap-20 p-8 sm:p-12"
        >
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <Coins className="h-8 w-8" />
              <h1>Coinstalker</h1>
            </div>
          </div>
          <div className="flex-[4_4_0%] flex flex-col">
            <TabsList className="flex gap-4 justify-start p-0 tracking-tight">
              <TabOption
                title="Wallet"
                icon={<Wallet className="w-4 h-4" />}
                value="wallet"
                tab={tab}
              />
              <TabOption
                title="Balance"
                icon={<ChartLine className="w-4 h-4" />}
                value="balance"
                tab={tab}
              />
              <TabOption
                title="Tx History"
                icon={<Receipt className="w-4 h-4" />}
                value="history"
                tab={tab}
              />
            </TabsList>
            <div className="flex flex-col flex-1 mt-8">
              <TabsContent value="wallet" className="fade-in-left">
                Change your password here.
              </TabsContent>
              <TabsContent value="balance" className="fade-in-left">
                <span>Make some money.</span>
              </TabsContent>
              <TabsContent value="history" className="fade-in-left">
                <span>Add stuff here.</span>
              </TabsContent>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs text-gray-500 flex gap-1 items-center">
              <Copyright className="h-4 w-4" />
              2025 - Coinstalker - All rights reserved.
            </p>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

const TabOption = ({
  title,
  icon,
  value,
  tab,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  tab: string;
}) => {
  return (
    <TabsTrigger
      value={value}
      className="relative flex data-[state=active]:text-slate-800 items-center"
    >
      {icon}
      <span className="ml-1 font-medium pt-0.5">{title}</span>
      {tab === value && (
        <span className="-bottom-1 left-[50%] -translate-x-[50%] fade-in-left-lg absolute bg-orange-400 rounded-full h-1 w-[90%]" />
      )}
    </TabsTrigger>
  );
};
