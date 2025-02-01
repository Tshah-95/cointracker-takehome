import prisma from "@/prisma/db";

const LIMIT = 10000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let createdAddress = await prisma.address.create({
      data: { address: body.address },
    });

    // I really wanted to offload this to a trigger.dev job but im slow
    let allTransactions: any[] = [];
    let endBalance = null;
    let endUsdBalance = null;
    let transactionCount = 0;
    let offset = 0;

    do {
      let res = await fetch(
        `https://api.blockchair.com/bitcoin/dashboards/address/${body.address}?transaction_details=true&offset=${offset}&limit=${LIMIT}`
      );

      let data = await res.json();
      const { address, transactions } = data.data[body.address];

      transactionCount = address.transaction_count;
      if (!endBalance) endBalance = address.balance;
      if (!endUsdBalance) endUsdBalance = address.balance_usd;
      offset += transactions.length;
      allTransactions.push(...transactions);
    } while (allTransactions.length !== transactionCount);

    await prisma.balance.create({
      data: {
        address_id: createdAddress.id,
        balance: endBalance,
        balance_usd: endUsdBalance,
      },
    });

    await prisma.transaction.createMany({
      data: allTransactions.map((t) => ({
        block_id: t.block_id,
        hash: t.hash,
        time: new Date(t.time),
        balance_change: t.balance_change,
        address_id: createdAddress.id,
      })),
    });

    await prisma.address.update({
      where: { id: createdAddress.id },
      data: { is_loaded: true },
    });

    return Response.json(createdAddress);
  } catch (e: any) {
    console.error(e.message);
    return Response.error();
  }
}
