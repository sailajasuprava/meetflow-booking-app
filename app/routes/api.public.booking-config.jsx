import prisma from "../db.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return Response.json(null);
  }

  const config = await prisma.bookingConfig.findUnique({
    where: { shop },
  });

  return Response.json(config);
}
