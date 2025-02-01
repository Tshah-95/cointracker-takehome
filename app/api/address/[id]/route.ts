import prisma from "@/prisma/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    let awaitedParams = await params;

    await prisma.address.delete({
      where: { id: +awaitedParams.id },
    });

    return Response.json({ id: awaitedParams.id });
  } catch (e: any) {
    console.error(e.message);
    return Response.error();
  }
}
