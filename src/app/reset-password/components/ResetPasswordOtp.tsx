"use client";

import type React from "react";

import {
  useState,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
} from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { verifyOtp } from "@/services/reset-password/ResetPasswordQuery";
import { Response } from "@/types/common";
import { TUser } from "@/types/user";
import toast from "react-hot-toast";
import Link from "next/link";

const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface PasswordResetOTPProps {
  email: string;
  onVerified?: () => void;
}

export default function PasswordResetOTP({
  email,
  onVerified,
}: PasswordResetOTPProps) {
  const [otpArray, setOtpArray] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow one digit
    if (value.length > 1) return;

    // Update the OTP array
    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    // Update the form value
    form.setValue("otp", newOtp.join(""), { shouldValidate: true });

    // Move to next input if current input is filled
    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && otpArray[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpArray(digits);
      form.setValue("otp", pastedData, { shouldValidate: true });

      // Focus the last input
      inputRefs.current[3]?.focus();
    }
  };

  const onSubmit = async (data: OtpFormValues) => {
    try {
      const response: Response<TUser> = await verifyOtp(email, data.otp);

      // console.log("OTP verification success:", response.data);
      // console.log("otp response is ", response);
      if (response.status && onVerified) {
        onVerified();
      } else {
        throw new Error(response.message || "Failed to verify OTP");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <div className="mb-8">
          <Link
            className="text-gray-500 hover:text-gray-700"
            href={"/forgot-password"}
          >
            <ArrowLeft size={20} />
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-[#7C5DFA] mb-2">
          Reset your password
        </h1>
        <p className="text-gray-500 mb-8">
          Enter the OTP code send to your email and reset your password.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({}) => (
                <FormItem>
                  <label
                    htmlFor="otp-1"
                    className="block text-sm font-medium text-gray-700 mb-3"
                  >
                    Enter OTP code
                  </label>
                  <FormControl>
                    <div className="flex gap-4 justify-between">
                      {otpArray.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-full h-12 text-center border-b-2 border-gray-300 focus:border-[#7C5DFA] focus:outline-none text-lg"
                          aria-label={`OTP digit ${index + 1}`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-2" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 bg-[#7C5DFA] hover:bg-[#6A4DF4] text-white rounded-md transition-colors flex items-center justify-center"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
