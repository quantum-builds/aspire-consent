"use client";

import { useState } from "react";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResetPassword } from "@/services/reset-password/ResetPasswordMutation";
import toast from "react-hot-toast";
import axios from "axios";

// Define the password schema with all requirements
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ResetPasswordProps {
  email: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function ResetPassword({
  email,
  onBack,
  onSuccess,
}: ResetPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change for real-time feedback
  });

  const { watch } = form;
  const password = watch("password");

  // Password validation criteria
  const hasMinLength = password?.length >= 8;
  const hasUppercase = /[A-Z]/.test(password || "");
  const hasNumber = /[0-9]/.test(password || "");
  const passwordsMatch =
    password === form.watch("confirmPassword") && password !== "";

  async function onSubmit(data: PasswordFormValues) {
    resetPassword(
      {
        email,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Otp send on provided email");
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response) {
            const message =
              err.response.data?.message || "Something went wrong";
            toast.error(message);
          } else {
            toast.error("Network error. Please check your connection.");
          }
        },
      }
    );
  }
  const ValidationItem = ({
    isValid,
    text,
  }: {
    isValid: boolean;
    text: string;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <X size={16} className="text-gray-400" />
      )}
      <span className={isValid ? "text-green-500" : "text-gray-500"}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <div className="mb-8">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onBack}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-[#7C5DFA] mb-2">
          Reset your password
        </h1>
        <p className="text-gray-500 mb-8">
          Create a new password for your account.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        className="pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Password requirements:
              </h3>
              <div className="space-y-1">
                <ValidationItem
                  isValid={hasMinLength}
                  text="At least 8 characters"
                />
                <ValidationItem
                  isValid={hasUppercase}
                  text="At least one uppercase letter"
                />

                <ValidationItem
                  isValid={hasNumber}
                  text="At least one number"
                />
                <ValidationItem
                  isValid={passwordsMatch}
                  text="Passwords match"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="w-full py-3 bg-[#7C5DFA] hover:bg-[#6A4DF4] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Reseting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
