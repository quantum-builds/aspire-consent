"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/RichTextEditor";
import toast from "react-hot-toast";
import { TDentistProcedure } from "@/types/dentist-procedure";
import { ExtendedTUser } from "@/types/user";
import { useCreateConsentFormLink } from "@/services/consent-form/ConsentFomMutation";
import { useSendEmail } from "@/services/email/emailMutation";
import axios from "axios";
import { stripHtml } from "string-strip-html";
import { useState } from "react";

// Define the form schema with Zod
const formSchema = z.object({
  patient: z
    .string({
      required_error: "Please select a patient",
    })
    .min(1, "Patient selection is required"),
  treatment: z
    .string({
      required_error: "Please select a treatment",
    })
    .min(1, "Treatment selection is required"),
  treatmentDate: z
    .string({
      required_error: "Please select a treatment date",
    })
    .min(1, "Treatment date is required"),
  customNote: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ConstsentFormProps = {
  procedures: TDentistProcedure[];
  patients: ExtendedTUser[];
  procedureErrorMessage?: string;
  patientErrorMessage?: string;
};

export default function ConsentForm({
  procedures,
  patients,
}: ConstsentFormProps) {
  const { mutate: createConsentLink, isPending: isLinkPending } =
    useCreateConsentFormLink();
  const { mutate: sendEmail, isPending: isEmailPending } = useSendEmail();
  const [editorKey, setEditorKey] = useState(0);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: "",
      treatment: "",
      treatmentDate: "",
      customNote: "",
    },
    mode: "onSubmit", // Validate on form submission
  });

  function onSubmit(data: FormValues) {
    createConsentLink(
      {
        patientId: data.patient,
        procedureId: data.treatment,
        expiresAt: data.treatmentDate,
      },
      {
        onSuccess: (responseData) => {
          const emailContent = {
            to: responseData.patientEmail,
            subject: "Consent Form to Fill",
            text: `This is the consent form sent by ${
              responseData.dentistEmail
            }.\n\n${
              data.customNote
                ? `Additional Note:\n${stripHtml(data.customNote).result}\n\n`
                : ""
            }Please fill out the consent form at the following link:\n${
              process.env.NEXT_PUBLIC_BASE_URL
            }consent-form/${responseData.token}?email=${
              responseData.patientEmail
            }`,
            html: `<p>This is the consent form sent by ${
              responseData.dentistEmail
            }.</p>
      ${
        data.customNote
          ? `<div><strong>Additional Note:</strong><p>${data.customNote}</p></div>`
          : ""
      }
      <p>Please click the link below to fill out the consent form:</p>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}consent-form/${
              responseData.token
            }?email=${responseData.patientEmail}" 
            style="color: #4f46e5; text-decoration: underline; font-weight: bold;">
            Click here to fill the consent form
          </a></p>`,
          };

          sendEmail(emailContent, {
            onSuccess: () => {
              toast.success("Consent Link sent to the provided email");
              form.reset();
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
          });
        },
        onError: (error) => {
          console.error("Error in generating Link:", error);
          toast.error("Failed to generate Consent Link");
        },
      }
    );
  }

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7"
        >
          <Card className="border p-3 md:p-8 lg:p-14">
            <CardContent className="flex flex-col gap-12">
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row justify-between items-start">
                    <FormLabel className="text-xl font-bold">
                      Choose patient
                    </FormLabel>
                    <div className="flex flex-col gap-3 w-full md:w-2/3">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="text-md md:text-xl px-4 min-h-[4rem] flex items-center">
                            <SelectValue
                              placeholder={"Select patient name"}
                              className="py-3"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full max-h-40">
                          {patients.length > 0 ? (
                            patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.fullName} - {patient.email}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-red- text-center">
                              No patient found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-md">
                        Select existing patient or add a new patient
                      </FormDescription>
                      {/* <button
                        type="button"
                        className="text-xl font-medium flex items-center mt-1 text-[#698AFF]"
                      >
                        + Add new patient
                      </button> */}
                      <FormMessage className="text-red-500" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row justify-between items-start">
                    <FormLabel className="text-xl font-bold">
                      Select Treatment
                    </FormLabel>
                    <div className="flex flex-col gap-3 w-full md:w-2/3">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="text-md md:text-xl px-4 min-h-[4rem] flex items-center">
                            <SelectValue
                              placeholder="Select procedure"
                              className="py-3"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full max-h-40">
                          {procedures.length > 0 ? (
                            procedures.map((procedure) => (
                              <SelectItem
                                key={procedure.procedure.id}
                                value={procedure.procedure.id}
                              >
                                {procedure.procedure.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-red-500 text-center">
                              No procedure found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-md">
                        Select from the list of treatments to select which
                        treatment this patient is being offered.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treatmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row justify-between items-start">
                    <FormLabel className="text-xl font-bold">
                      Date of Treatment
                    </FormLabel>
                    <div className="flex flex-col gap-3  w-full md:w-2/3">
                      <div className="relative flex items-center w-full">
                        <FormControl className="w-full">
                          <Input
                            type="datetime-local"
                            placeholder="Select date"
                            {...field}
                            min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                            className="pl-4 h-14 text-md md:text-xl"
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-md w-full">
                        Specify the date of treatment to ensure the consent is
                        completed by patient beforehand. Only future dates can
                        be selected.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </div>
                  </FormItem>
                )}
              />

              <Separator orientation="horizontal" className="mx-1 h-6" />

              <FormField
                control={form.control}
                name="customNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold mb-4">
                      Custom Email Note
                    </FormLabel>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                      <FormDescription className="text-lg font-normal w-full md:w-1/3">
                        Add a custom note to append to email that is sent to
                        patient.
                      </FormDescription>
                      <div className="flex flex-col w-full md:w-2/3 gap-4">
                        <FormControl>
                          <RichTextEditor
                            key={editorKey}
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="<p>Enter your custom note here..</p>"
                            className="min-h-[200px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-6">
            <button
              type="button"
              onClick={() => {
                form.reset();
                setEditorKey((prev) => prev + 1);
              }}
              className="cursor-pointer text-md hover:underline text-[#698AFF]"
            >
              Clear Form
            </button>
            <Button
              type="submit"
              className="bg-[#698AFF] py-6 text-lg"
              disabled={isLinkPending || isEmailPending}
            >
              {isLinkPending || isEmailPending
                ? "Processing..."
                : "Save & Send by Email"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
