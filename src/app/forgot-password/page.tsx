"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSendEmail } from "@/services/email/emailMutation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define the form schema with Zod
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { mutate: sendEmail, isPending } = useSendEmail();
  const router = useRouter();

  // Initialize the form
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: ForgotPasswordValues) {
    sendEmail(
      {
        to: data.email,
        subject: "Password Reset Otp",
        text: "Otp to reset password is",
      },
      {
        onSuccess: () => {
          toast.success("Otp send on provided email");
          router.replace(`/reset-password?email=${data.email}`);
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-indigo-500">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your password will be reset by email we will send the OTP to reset
            your password.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter your email address
              </label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          className="pl-10 py-5 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  {" "}
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
