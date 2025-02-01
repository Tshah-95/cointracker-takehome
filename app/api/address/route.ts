import prisma from "@/prisma/db";

export async function POST(request: Request) {
  const body = await request.json();

  await prisma.address.create({ data: { address: body.address } });

  return Response.json({ hi: "bye" });
}
