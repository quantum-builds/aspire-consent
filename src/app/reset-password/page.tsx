import { Suspense } from "react";
import PasswordResetFlow from "@/app/reset-password/components/ResetPasswordFlow";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordResetFlow />
    </Suspense>
  );
}
