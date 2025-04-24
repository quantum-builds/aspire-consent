"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { AspireConsentBlackLogo } from "@/asssets";
import Link from "next/link";

// Define the login form schema with Zod
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean(),
  role: z.enum(["patient", "dentist"]),
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "";

  const callbackUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("callbackUrl")
      : null;

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      role: "patient",
    },
  });

  // Update the role field when the tab changes
  const handleRoleChange = (value: string) => {
    form.setValue("role", value as "patient" | "dentist");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      role: data.role, // Use the role from the form data
    });
    console.log("result is ", res);
    if (res?.ok) {
      toast.success("User logged in successfully");
      if (callbackUrl) {
        router.replace(callbackUrl);
      } else {
        router.replace(
          data.role === "dentist" ? "/dentist/dashboard" : "/patient/dashboard"
        );
      }
    } else {
      toast.error("User logged in failed");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (role === "dentist" || role === "patient") {
      form.setValue("role", role);
    }
  }, [role, form]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-12 w-32 mb-2 mx-auto">
            <Image
              src={AspireConsentBlackLogo || "/placeholder.svg"}
              alt="Aspire Logo"
              width={150}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please enter your details
          </p>
        </div>

        <Tabs
          defaultValue={role ? role : "patient"}
          className="mb-6"
          onValueChange={handleRoleChange}
        >
          <div className="bg-gray-100 p-1 rounded-lg mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="dentist">Dentist</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="pl-10 pr-10 py-5 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <div
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </div>
                    </div>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        id="remember-me"
                        className="h-4 w-4 border-gray-300 rounded"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-600"
                    >
                      Remember me
                    </label>
                  </FormItem>
                )}
              /> */}
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="text-indigo-500 hover:text-indigo-600"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full py-5 bg-indigo-500 hover:bg-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Logging In...
                  </>
                ) : (
                  "LogIn"
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have account?
              <a
                className="ml-1 text-indigo-500 hover:text-indigo-600 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  router.replace("/signup"); // Replaces current history entry
                }}
              >
                Sign Up
              </a>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
