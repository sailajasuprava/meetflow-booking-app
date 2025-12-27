// app/routes/api.book-appointment.jsx
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  // 1. Define CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Or "https://sailaja-store-2.myshopify.com"
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // 2. Handle the Preflight (OPTIONS) request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // 3. Authenticate the request
    // authenticate.publicApp uses the 'shop' query param to identify the store
    const { session } = await authenticate.publicApp(request);
    const body = await request.json();

    const shopDomain =
      session?.shop || new URL(request.url).searchParams.get("shop");

    if (!shopDomain) {
      return Response.json(
        { error: "Missing shop parameter" },
        { status: 400, headers: corsHeaders },
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        shop: shopDomain,
        selectedDate: body.selectedDate,
        timeRange: body.selectedTimeRange,
        durationHours: body.durationHours?.toString(),
        durationMinutes: body.durationMinutes?.toString(),
      },
    });

    return Response.json(
      { success: true, appointmentId: appointment.id },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json(
      { error: "Failed to create appointment" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// Optional loader to keep the endpoint "alive" for GET checks
export async function loader() {
  return Response.json(
    { message: "Booking API ready" },
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  );
}
