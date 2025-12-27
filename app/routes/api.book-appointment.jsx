// app/routes/api.book-appointment.jsx

import prisma from "../db.server";

/**
 * Utility: CORS headers
 * Echoing back Origin is required for Shopify storefront requests
 */
function getCorsHeaders(request) {
  const origin = request.headers.get("Origin");

  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

/**
 * LOADER
 * Handles preflight (OPTIONS) requests
 */
export async function loader({ request }) {
  const headers = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers,
    });
  }

  // Optional health check
  return new Response(JSON.stringify({ message: "Booking API ready" }), {
    status: 200,
    headers,
  });
}

/**
 * ACTION
 * Handles appointment creation
 */
export async function action({ request }) {
  const headers = getCorsHeaders(request);

  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers,
      });
    }

    const body = await request.json();
    const url = new URL(request.url);

    const shop = url.searchParams.get("shop");

    if (!shop) {
      return new Response(JSON.stringify({ error: "Missing shop parameter" }), {
        status: 400,
        headers,
      });
    }

    const {
      selectedDate,
      selectedTimeRange,
      durationHours,
      durationMinutes,
      customerEmail,
      customerName,
    } = body;

    // 🔒 HARD VALIDATION (prevents Prisma crashes)
    if (!selectedDate || !selectedTimeRange) {
      return new Response(
        JSON.stringify({ error: "Invalid appointment data" }),
        { status: 400, headers },
      );
    }

    const appointment = await prisma.appointments.create({
      data: {
        shop,
        selectedDate: String(selectedDate),
        timeRange: String(selectedTimeRange),
        durationHours: durationHours?.toString() || null,
        durationMinutes: durationMinutes?.toString() || null,
        customerEmail: customerEmail || null,
        customerName: customerName || null,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        appointmentId: appointment.id,
      }),
      { status: 200, headers },
    );
  } catch (error) {
    console.error("❌ Booking error FULL:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create appointment",
        details: error.message,
      }),
      { status: 500, headers },
    );
  }
}
