// app/routes/api.book-appointment.jsx
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  // CORS Headers for public requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This looks for the ?shop= query parameter you added in step 1
    const { session } = await authenticate.publicApp(request);
    const body = await request.json();

    const appointment = await prisma.appointment.create({
      data: {
        shop: session
          ? session.shop
          : new URL(request.url).searchParams.get("shop"),
        selectedDate: body.selectedDate,
        timeRange: body.selectedTimeRange,
        durationHours: body.durationHours.toString(),
        durationMinutes: body.durationMinutes.toString(),
      },
    });

    return Response.json(
      { success: true, appointmentId: appointment.id },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json(
      { error: "Failed to create appointment" },
      { status: 500, headers: corsHeaders },
    );
  }
}
