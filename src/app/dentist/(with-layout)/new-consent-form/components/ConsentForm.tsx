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
import { useRouter } from "next/navigation";

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

//https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/uploads/aspire-consent/aspire-consent-black-logo.svg
export default function ConsentForm({
  procedures,
  patients,
}: ConstsentFormProps) {
  const { mutate: createConsentLink, isPending: isLinkPending } =
    useCreateConsentFormLink();
  const { mutate: sendEmail, isPending: isEmailPending } = useSendEmail();
  const [editorKey, setEditorKey] = useState(0);
  const router = useRouter();

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
          // console.log("patient email is ", responseData);
          const selectedProcedure = procedures.find(
            (proc) => proc.procedure.id === data.treatment
          );

          // Get the procedure name or fallback to "Dental Procedure"
          const procedureName =
            selectedProcedure?.procedure.name || "Dental Procedure";

          // Create your HTML template
          const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consent Form Required</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 200px;
            height: auto;
            margin-bottom: 20px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        .note {
            background-color: #eef2ff;
            border-left: 4px solid #4f46e5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4f46e5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 15px 0;
        }
        .footer {
            font-size: 12px;
            color: #777777;
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
        }
        .details {
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 8px;
        }
        .detail-label {
            font-weight: bold;
            width: 120px;
        }
    </style>
</head>
<body>
    <div class="header">
        <!-- Use the direct public S3 URL for your logo -->
        <img src="https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${
            process.env.NEXT_PUBLIC_AWS_REGION
          }.amazonaws.com/uploads/aspire-consent/aspire-academy-logo.png" 
             alt="Dental Clinic Logo" 
             class="logo">
        <h1 style="color: #4f46e5; margin-bottom: 10px;">Consent Form Required</h1>
    </div>
    <div class="content">
        <p>Dear ${responseData.patientName || "Patient"},</p>
        
        <p>Your dental provider <strong>${
          responseData.dentistName || responseData.dentistEmail
        }</strong> has requested you to complete a consent form for your upcoming procedure.</p>
        <div class="details">
            <div class="detail-row">
                <span class="detail-label">Procedure:</span>
                <span>${procedureName || "Dental Procedure"}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Scheduled Date:</span>
                <span>${new Date(data.treatmentDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</span>
            </div>
        </div>
        ${
          data.customNote
            ? `
        <div class="note">
            <strong>Note from your dentist:</strong><br/>
            ${data.customNote}
        </div>
        `
            : ""
        }
        <p style="margin-bottom: 25px;">Please click the button below to complete your consent form at your earliest convenience:</p>
<div style="text-align: center;">
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}consent-form/${
            responseData.token
          }" 
       style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0;">
        Complete Consent Form
    </a>
</div>
        <p style="font-size: 14px; color: #666666;">
            <strong>Important:</strong> This consent form must be completed prior to your scheduled appointment.
        </p>
    </div>
    <div class="footer">
        <p>If you have any questions or need to reschedule, please contact our office at ${
          responseData.dentistEmail
        }.</p>
        <p>© ${new Date().getFullYear()} Your Dental Clinic. All rights reserved.</p>
    </div>
</body>
</html>
`;

          // Create simple text version for non-HTML clients
          const textContent = `This is the consent form sent by ${
            responseData.dentistEmail
          }.\n\n${
            data.customNote
              ? `Additional Note:\n${stripHtml(data.customNote).result}\n\n`
              : ""
          }Please fill out the consent form at the following link:\n${
            process.env.NEXT_PUBLIC_BASE_URL
          }consent-form/${responseData.token}?email=${
            responseData.patientEmail
          }`;

          // Direct call to your sendEmail function
          sendEmail(
            {
              to: responseData.patientEmail,
              subject:
                "Consent Form Required for Your Upcoming Dental Procedure",
              text: textContent,
              html: htmlTemplate, // Pass the complete HTML template
            },
            {
              onSuccess: () => {
                toast.success("Consent Link sent to the provided email");
                form.reset();
                setTimeout(() => {
                  router.refresh();
                }, 100);
                setEditorKey((prev) => prev + 1);
                router.back();
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
                    <div className="flex flex-col gap-3 w-full md:w-2/3">
                      <div className="relative flex items-center w-full">
                        <FormControl className="w-full">
                          <Input
                            type="datetime-local"
                            placeholder="Select date and time"
                            {...field}
                            min={new Date().toISOString().slice(0, 16)} // Sets min to current datetime
                            className="pl-4 h-14 text-md md:text-xl"
                            onChange={(e) => {
                              // Additional validation to ensure date is not in the past
                              const selectedDate = new Date(e.target.value);
                              const now = new Date();
                              if (selectedDate < now) {
                                // Reset to current datetime if past date is selected
                                field.onChange(now.toISOString().slice(0, 16));
                              } else {
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-md w-full">
                        Specify the date and time of treatment to ensure the
                        consent is completed by patient beforehand. Only future
                        dates/times can be selected.
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
