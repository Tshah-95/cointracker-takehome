import prisma from "@/prisma/db";

export async function GET() {
  const addresses = await prisma.address.findMany({
    include: { balance: true },
  });

  return Response.json(
    addresses.map((a) => ({
      ...a,
      balance: { ...a.balance, balance: a.balance?.balance.toString() },
    }))
  );
}
