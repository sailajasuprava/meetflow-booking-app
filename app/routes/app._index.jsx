import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { Page, Card, Button, BlockStack, InlineStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import WelcomeScreen from "../components/WelcomeScreen";
import StepHeader from "../components/StepHeader";
import Step2BookingType from "../components/Step2BookingType";
import Step3TimeSlot from "../components/Step3TimeSlot";
import Step4WorkingHours from "../components/Step4WorkingHours";
import Step5EnableExtension from "../components/Step5EnableExtension";

/* -------------------- LOADER (IMPORTANT) -------------------- */
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return {
    shop: session.shop,
  };
};
/* ------------------------------------------------------------ */

export default function AppIndex() {
  const navigate = useNavigate();
  const { shop } = useLoaderData();

  useEffect(() => {
    console.log("AppIndex rendered, shop:", shop);
  }, [shop]);

  const [step, setStep] = useState(0);

  const next = () => {
    setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <Page
      title="MeetFlow: Appointment Booking"
      primaryAction={{
        content: "View all bookings",
        onAction: () => navigate("/app/manage-bookings"),
      }}
    >
      <BlockStack gap="400">
        {step > 0 && <StepHeader currentStep={step} />}

        <Card padding="600">
          {/* Main content */}
          {step === 0 && <WelcomeScreen />}
          {step === 1 && <Step2BookingType />}
          {step === 2 && <Step3TimeSlot />}
          {step === 3 && <Step4WorkingHours />}
          {step === 4 && <Step5EnableExtension shop={shop} />}

          {/* Navigation buttons */}
          <div style={{ marginTop: 32 }}>
            <InlineStack align="space-between" gap="200">
              <Button disabled={step === 0} onClick={back}>
                Back
              </Button>

              <Button variant="primary" onClick={next}>
                Continue
              </Button>
            </InlineStack>
          </div>
        </Card>
      </BlockStack>
    </Page>
  );
}
