import prisma from "@/prisma/db";

export async function GET() {
  // ideally paginated to handle large tx counts
  const transactions = await prisma.transaction.findMany({
    include: { address: true },
  });

  return Response.json(
    transactions.map((t) => ({
      ...t,
      balance_change: t.balance_change.toString(),
      address_hash: t.address.address,
    }))
  );
}
