import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/utils";
import {
  Calendar,
  CircleDollarSign,
  DownloadCloud,
  Home,
  MapPin,
  Trash,
  Trash2,
} from "lucide-react";
import { useCallback } from "react";
import useSWR from "swr";
import { format } from "date-fns";

export const Wallet = () => {
  const { data, mutate } = useSWR("/api/addresses", fetcher);
  console.log({ data });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const address = formData.get("address");

      if (!address) return;

      await fetch("/api/address", {
        method: "POST",
        body: JSON.stringify({ address }),
      });

      mutate();
    },
    [mutate]
  );
  return (
    <Card className="flex flex-col h-full w-full flex-1 bg-gray-200 p-4">
      <div className="flex flex-col gap-8 sm:gap-12 items-center justify-between p-4 w-full h-full flex-1">
        <form
          className="w-full flex items-center gap-4 sm:gap-6 justify-center"
          onSubmit={handleSubmit}
        >
          <Input
            name="address"
            placeholder="Enter bitcoin address"
            className="w-48 sm:w-96 text-center shadow-none border-b-2 border-b-gray-700 rounded-none focus:rounded-md"
          />
          <Button className="sm:px-8 sm:py-5">Track</Button>
        </form>
        <div className="flex flex-col overflow-x-auto w-full flex-1 text-sm sm:text-base sm:items-center gap-4">
          {data?.map((addressData: any) => (
            <div
              className="border-2 border-gray-800 p-2 rounded-md flex gap-4 sm:gap-8 min-w-fit sm:w-fit"
              key={addressData.id}
            >
              <span className="flex items-center gap-1 sm:gap-1.5">
                <MapPin className="w-4 sm:h-5 h-4 sm:w-5" />
                <span
                  className="w-[8rem] md:w-[12rem] lg:w-[16rem] overflow-hidden text-ellipsis cursor-pointer active:bg-gray-100"
                  onClick={() =>
                    navigator.clipboard.writeText(addressData.address)
                  }
                >
                  {addressData.address}
                </span>
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5">
                <CircleDollarSign className="w-4 sm:h-5 h-4 sm:w-5" />
                {addressData.balance?.balance ?? "0.00"}
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5">
                <Calendar className="w-4 sm:h-5 h-4 sm:w-5" />
                {format(addressData.created_at, "MM/dd/yyyy")}
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5">
                <DownloadCloud className="w-4 sm:h-5 h-4 sm:w-5" />
                {addressData.is_loaded ? "Complete" : "Pending"}
              </span>
              <Button
                className="flex items-center bg-red-600"
                onClick={() =>
                  fetch(`/api/address/${addressData.id}`, {
                    method: "DELETE",
                  }).then(() => mutate())
                }
              >
                <Trash2 className="w-5 sm:h-6 h-5 sm:w-6 rounded-md" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
