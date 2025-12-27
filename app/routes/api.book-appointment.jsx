// app/routes/api.book-appointment.jsx
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  try {
    // ✅ Use authenticate.publicApp() for public storefront requests
    const { session } = await authenticate.publicApp(request);
    const body = await request.json();

    console.log("Received booking data:", body);

    const appointment = await prisma.appointment.create({
      data: {
        shop: session.shop,
        selectedDate: body.selectedDate,
        timeRange: body.selectedTimeRange,
        durationHours: body.durationHours,
        durationMinutes: body.durationMinutes,
      },
    });

    return Response.json({
      success: true,
      appointmentId: appointment.id,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}

// ✅ Add loader for GET requests (optional, for testing)
export async function loader({ request }) {
  return Response.json({ message: "Booking API ready" });
}
