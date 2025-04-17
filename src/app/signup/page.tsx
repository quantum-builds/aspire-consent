"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AspireConsentBlackLogo } from "@/asssets";
import Image from "next/image";
import axios from "axios";
import { useSignUp } from "@/services/auth/authMutation";

// Patient schema with all fields
const patientSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.string(),
});

const dentistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.string(),
});

type PatientFormValues = z.infer<typeof patientSchema>;
type DentistFormValues = z.infer<typeof dentistSchema>;

export default function SignupForm() {
  const { mutate: signUp, isPending } = useSignUp();
  const router = useRouter();

  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "patient",
    },
  });

  // Dentist form
  const dentistForm = useForm<DentistFormValues>({
    resolver: zodResolver(dentistSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "dentist",
    },
  });

  const onPatientSubmit = (data: PatientFormValues) => {
    console.log("Patient signup:", data);
    signUp(
      {
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phoneNumber,
        role: data.role,
      },
      {
        onSuccess: () => {
          toast.success("User registered successfully");
          router.replace("/login");
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
  };

  const onDentistSubmit = (data: DentistFormValues) => {
    console.log("Dentist signup:", data);
    signUp(
      {
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          toast.success("User registered successfully");
          router.replace("/login");
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
  };

  // const watchedPatientEmail = patientForm.watch("email");
  // const watchedDentistEmail = dentistForm.watch("email");
  // const email =
  //   userType === "patient" ? watchedPatientEmail : watchedDentistEmail;

  // useEffect(() => {
  //   console.log("dentist :", isSubmittingDentist);
  //   console.log("patient :", isSubmittingPatient);
  // }, [isSubmittingDentist, isSubmittingPatient]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <div className="relative h-12 w-32 mb-4 mx-auto">
          <Image
            src={AspireConsentBlackLogo}
            alt="Aspire Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium text-center">
            Create your account
          </h2>
          <p className="text-gray-500 text-center text-sm mt-1">
            Please enter your details
          </p>
        </div>

        <Tabs defaultValue="patient" className="mb-6">
          <div className="bg-gray-100 p-1 rounded-lg mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="dentist">Dentist</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="patient">
            <Form {...patientForm}>
              <form
                onSubmit={patientForm.handleSubmit(onPatientSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={patientForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Full name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={patientForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Email"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={patientForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Phone number"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={patientForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="Password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#7C5DFA] hover:bg-[#6A4DF4] text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="dentist">
            <Form {...dentistForm}>
              <form
                onSubmit={dentistForm.handleSubmit(onDentistSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={dentistForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Email"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={dentistForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="Password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#7C5DFA] hover:bg-[#6A4DF4] text-white"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing Up...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a
            className="text-[#7C5DFA] font-medium hover:underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              router.replace("/login");
            }}
          >
            Login Now
          </a>
        </div>
      </div>
    </div>
  );
}
