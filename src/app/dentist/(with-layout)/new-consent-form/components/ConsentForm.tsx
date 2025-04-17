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
import { FileUploader, FileType } from "@/components/FileUploader";
import { RichTextEditor } from "@/components/RichTextEditor";
import toast from "react-hot-toast";
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

export default function ConsentForm() {
  const [uploadedFiles, setUploadedFiles] = useState<FileType[] | null>(null);

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

  // Handle file upload
  const handleFileUpload = (files: FileType[] | null) => {
    setUploadedFiles(files);
  };

  // Form submission handler
  function onSubmit(data: FormValues) {
    const formData = {
      ...data,
      attachments: uploadedFiles,
    };

    toast.success("Consent form created");
    console.log(formData);
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
                          <SelectItem value="patient1">John Doe</SelectItem>
                          <SelectItem value="patient2">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-md">
                        Select existing patient or add a new patient
                      </FormDescription>
                      <button
                        type="button"
                        className="text-xl font-medium flex items-center mt-1 text-[#698AFF]"
                      >
                        + Add new patient
                      </button>
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
                          <SelectItem value="treatment1">
                            Dental Cleaning
                          </SelectItem>
                          <SelectItem value="treatment2">Root Canal</SelectItem>
                          <SelectItem value="treatment3">
                            Tooth Extraction
                          </SelectItem>
                          <SelectItem value="treatment4">
                            Orthodontic Treatment
                          </SelectItem>
                          <SelectItem value="treatment5">
                            Wisdom Tooth Extractions
                          </SelectItem>
                          <SelectItem value="treatment6">
                            Dental Implants
                          </SelectItem>
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
                    <FormLabel className="text-xl font-bold flex-1">
                      Date of Treatment
                    </FormLabel>
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="relative flex items-center">
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Select date"
                            {...field}
                            min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                            className="pl-4 h-14 text-md md:text-xl"
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-md">
                        Specify the date of treatment to ensure the consent is
                        completed by patient beforehand. Only future dates can
                        be selected.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </div>
                    <div className="flex-1"></div>
                  </FormItem>
                )}
              />

              <Separator orientation="horizontal" className="mx-1 h-6" />

              <h2 className="text-xl font-bold">Attachments & Custom Text</h2>

              <FormItem className="flex flex-col md:flex-row justify-between items-start">
                <FormLabel className="text-lg font-normal">
                  Attach File(s)
                </FormLabel>
                <div className="w-full md:w-2/3 flex flex-col gap-2">
                  <FileUploader
                    onFileUpload={handleFileUpload}
                    maxFiles={5}
                    showPreview={true}
                    text="Drop files here or click to upload"
                    extraText="You can upload multiple files (up to 5)"
                    allowedTypes={[
                      "image/jpeg",
                      "image/png",
                      "application/pdf",
                      "video/mp4",
                    ]}
                    alwaysShowDropzone={true}
                  />
                  <FormDescription className="text-lg text-muted-foreground">
                    Upload single or multiple files to support this consent
                    form.
                  </FormDescription>
                </div>
              </FormItem>

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

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                form.reset();
                setUploadedFiles(null);
              }}
              className="cursor-pointer text-md hover:underline text-[#698AFF]"
            >
              Clear Form
            </button>
            <Button type="submit" className="bg-[#698AFF] py-6 text-lg">
              Save & send by email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
