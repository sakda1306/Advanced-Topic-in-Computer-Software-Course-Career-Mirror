import { Suspense } from "react";
import { StepIndicator } from "@/components/app/step-indicator";
import { Intake } from "@/components/intake/intake";

export const metadata = { title: "ข้อมูลของคุณ" };

// Step 1 of 4: intake (DesignSystem.md section 4, FR-0 – FR-9, FR-14).
export default function StartPage() {
  return (
    <>
      <StepIndicator current={1} unlocked={1} />
      {/* useSearchParams (the ?tab= value) needs a Suspense boundary */}
      <Suspense>
        <Intake />
      </Suspense>
    </>
  );
}
