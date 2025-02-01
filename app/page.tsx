"use client";

import {
  AlertTriangle,
  ChartLine,
  Coins,
  Copyright,
  Receipt,
  Wallet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Wallet as WalletContent } from "./Wallet";
import { Analytics } from "./Analytics";
import { TransactionHistory } from "./TransactionHistory";

export default function Home() {
  const [tab, setTab] = useState("wallet");

  return (
    <div className="bg-neutral-100 flex justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col w-full h-full min-h-screen max-w-screen-xl">
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
            <TabsList className="flex gap-y-2 sm:gap-x-4 sm:gap-y-0 justify-start p-0 tracking-tight flex-col sm:flex-row">
              <div className="flex gap-4 justify-start">
                <TabOption
                  title="Wallet"
                  icon={<Wallet className="w-4 h-4" />}
                  value="wallet"
                  tab={tab}
                />
                <TabOption
                  title="Tx History"
                  icon={<Receipt className="w-4 h-4" />}
                  value="history"
                  tab={tab}
                />
              </div>
              <div className="flex gap-4 justify-start">
                <TabOption
                  title="Analytics"
                  icon={<ChartLine className="w-4 h-4" />}
                  value="analytics"
                  tab={tab}
                />
                <TabOption
                  title="Alerts"
                  icon={<AlertTriangle className="w-4 h-4" />}
                  value="alerts"
                  tab={tab}
                />
              </div>
            </TabsList>
            <div className="flex flex-col flex-1 mt-12">
              {/* data-[state=inactive]:hidden -- without this property the height is distributed across all 3 elements */}
              <TabsContent
                value="wallet"
                className="flex flex-col flex-1 data-[state=inactive]:hidden fade-in-left"
              >
                <WalletContent />
              </TabsContent>
              <TabsContent
                value="analytics"
                className="flex flex-col flex-1 data-[state=inactive]:hidden fade-in-left"
              >
                <Analytics />
              </TabsContent>
              <TabsContent
                value="history"
                className="flex flex-col flex-1 data-[state=inactive]:hidden fade-in-left"
              >
                <TransactionHistory />
              </TabsContent>
              <TabsContent
                value="alerts"
                className="flex flex-col flex-1 data-[state=inactive]:hidden fade-in-left max-w-[30rem]"
              >
                Would be nice to configure some options for triggering
                texts/emails when balances change or uknown addresses transact
                with you
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
      className="relative flex data-[state=active]:text-slate-800 items-center select-none"
    >
      {icon}
      <span className="ml-1 font-medium pt-0.5">{title}</span>
      {tab === value && (
        <span className="-bottom-1 left-[50%] -translate-x-[50%] fade-in-left-lg absolute bg-orange-400 rounded-full h-1 w-[90%]" />
      )}
    </TabsTrigger>
  );
};
