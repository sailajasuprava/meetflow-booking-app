import { useLoaderData, useSubmit } from "react-router";
import { Page, Card, DataTable, Text, Button, Modal } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/* -------------------- LOADER -------------------- */
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const appointments = await prisma.appointment.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return { appointments };
};

/* -------------------- ACTION -------------------- */
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const id = formData.get("id");

  if (!id) {
    throw new Error("Missing appointment id");
  }

  await prisma.appointment.deleteMany({
    where: {
      id, // UUID string
      shop: session.shop,
    },
  });

  return { success: true };
};

/* ------------------------------------------------ */

export default function ManageBookings() {
  const { appointments } = useLoaderData();
  const submit = useSubmit();

  // State for Confirmation Modal
  const [active, setActive] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const toggleModal = () => setActive(!active);

  const openConfirmation = (id) => {
    setSelectedId(id);
    toggleModal();
  };

  const handleDelete = () => {
    submit({ id: selectedId }, { method: "POST" });
    toggleModal();
  };

  const rows = appointments.map((a) => [
    a.id || "—",
    a.selectedDate,
    a.timeRange,
    `${a.durationHours ?? 0}h ${a.durationMinutes ?? 0}m`,
    <Button
      key={a.id}
      icon={DeleteIcon}
      tone="critical"
      variant="tertiary"
      onClick={() => openConfirmation(a.id)}
    />,
  ]);

  return (
    <Page title="Bookings" backAction={{ content: "Back", url: "/app" }}>
      <Card padding="600">
        {appointments.length === 0 ? (
          <Text as="p" tone="subdued">
            No bookings yet.
          </Text>
        ) : (
          <DataTable
            columnContentTypes={["text", "text", "text", "text", "numeric"]}
            headings={["Booking ID", "Date", "Time", "Duration", "Action"]}
            rows={rows}
          />
        )}
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={active}
        onClose={toggleModal}
        title="Cancel Appointment?"
        primaryAction={{
          content: "Delete Booking",
          onAction: handleDelete,
          destructive: true,
        }}
        secondaryActions={[
          {
            content: "Keep Booking",
            onAction: toggleModal,
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Are you sure you want to delete this appointment? This action cannot
            be undone.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
