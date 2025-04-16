"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import PasswordResetOTP from "@/app/reset-password/components/ResetPasswordOtp";
import ResetPassword from "@/app/reset-password/components/ResetPassword";
import PasswordResetSuccess from "@/app/reset-password/components/ResetPasswordSuccess";

export default function PasswordResetFlow() {
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get("email");
  const email = rawEmail ? decodeURIComponent(rawEmail) : "";

  const [currentStep, setCurrentStep] = useState<"otp" | "reset" | "success">(
    "otp"
  );

  const handleOtpVerified = () => setCurrentStep("reset");
  const handleBackToOtp = () => setCurrentStep("otp");
  const handleResetSuccess = () => setCurrentStep("success");

  return (
    <div>
      {currentStep === "otp" ? (
        <PasswordResetOTP email={email} onVerified={handleOtpVerified} />
      ) : currentStep === "reset" ? (
        <ResetPassword
          email={email}
          onBack={handleBackToOtp}
          onSuccess={handleResetSuccess}
        />
      ) : (
        <PasswordResetSuccess />
      )}
    </div>
  );
}
