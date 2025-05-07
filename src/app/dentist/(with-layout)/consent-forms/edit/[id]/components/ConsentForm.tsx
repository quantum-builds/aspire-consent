"use client";

import { TConsentForm } from "@/types/consent-form";
import { Calendar, CheckCircle, Clock, Plus, Trash2, User } from "lucide-react";
import { useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSaveDraftAnswers } from "@/services/consent-form/ConsentFomMutation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  patient: z.object({
    fullName: z.string().min(1, "Patient name is required"),
  }),
  procedure: z.object({
    name: z.string().min(1, "Procedure name is required"),
  }),
  expiresAt: z.date({
    required_error: "Expiration date is required",
    invalid_type_error: "Invalid date format",
  }),
  isActive: z.boolean(),
  snapshotMCQs: z.array(
    z.object({
      id: z.string(),
      questionText: z.string().min(1, "Question text is required"),
      options: z.array(z.string().min(1, "Option cannot be empty")),
      correctAnswer: z.string().min(1, "Correct answer is required"),
      videoUrl: z.string().optional(),
      videoFile: z.union([z.instanceof(File), z.string()]).optional(),
    })
  ),
});

type FormValues = {
  patient: { fullName: string };
  procedure: { name: string };
  expiresAt: Date;
  isActive: boolean;
  snapshotMCQs: {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    videoUrl?: string;
    videoFile?: File | string;
  }[];
};

interface ConsentFormProps {
  data: TConsentForm | null;
  formId: string;
}

export default function ConsentForm({ data, formId }: ConsentFormProps) {
  const router = useRouter();

  const formatDateForInput = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";

    const pad = (num: number) => num.toString().padStart(2, "0");
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(
      localDate.getDate()
    )}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
  };

  const getCurrentLocalDatetime = () => {
    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localNow.toISOString().slice(0, 16);
  };
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: { fullName: data?.patient?.fullName || "" },
      procedure: { name: data?.procedure?.name || "" },
      expiresAt: data?.expiresAt ? new Date(data.expiresAt) : new Date(),
      isActive: data?.isActive ?? true,
      snapshotMCQs: data?.snapshotMCQs?.length
        ? data.snapshotMCQs.map((mcq) => ({
            id: mcq.id,
            questionText: mcq.questionText,
            options: mcq.options || ["", ""], // Ensure at least two empty options
            correctAnswer: mcq.correctAnswer,
            videoUrl: mcq.videoName,
            videoFile: mcq.videoUrl || undefined,
          }))
        : [
            {
              id: `new-question-${Date.now()}`,
              questionText: "",
              options: ["", ""], // Two empty options by default
              correctAnswer: "",
              videoUrl: "",
            },
          ],
    },
  });

  const {
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    watch,
    setValue,
  } = formMethods;

  const { mutate: saveDraft, isPending: isSavingDraft } = useSaveDraftAnswers();

  const isSubmittingForm = isSavingDraft;

  useEffect(() => {
    if (data) {
      reset({
        patient: {
          fullName: data.patient?.fullName || "",
        },
        procedure: {
          name: data.procedure?.name || "",
        },
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : new Date(),
        isActive: data.isActive === undefined ? true : data.isActive,
        snapshotMCQs: data.snapshotMCQs?.length
          ? data.snapshotMCQs.map((mcq) => ({
              id: mcq.id,
              questionText: mcq.questionText,
              options: mcq.options || ["", ""],
              correctAnswer: mcq.correctAnswer,
              videoUrl: mcq.videoName,
              videoFile: mcq.videoUrl || undefined,
            }))
          : [
              {
                id: `new-question-${Date.now()}`,
                questionText: "",
                options: ["", ""],
                correctAnswer: "",
                videoUrl: "",
              },
            ],
      });
    }
  }, [data, reset]);

  const handleSaveDraft = (formData: FormValues) => {
    const hasValidQuestions = formData.snapshotMCQs.some(
      (mcq) => mcq.questionText.trim() !== ""
    );

    if (!hasValidQuestions) {
      toast.error("Please add at least one valid question");
      return;
    }

    const formUpdates = {
      expiresAt: formData.expiresAt,
      isActive: formData.isActive,
    };

    const mcqUpdates = formData.snapshotMCQs.map((mcq) => {
      const videoPath =
        typeof mcq.videoFile === "object" && mcq.videoFile instanceof File
          ? `uploads/aspire-consent/${mcq.videoFile.name}`
          : mcq.videoUrl;

      return {
        id: mcq.id,
        questionText: mcq.questionText,
        correctAnswer: mcq.correctAnswer,
        options: mcq.options,
        videoUrl: videoPath,
      };
    });

    saveDraft(
      { role: "dentist", formId: formId, formUpdates, mcqUpdates },
      {
        onSuccess: () => {
          toast.success("Form updated successfully");
          router.refresh();
        },
        onError: () => toast.error("Failed to update form"),
      }
    );
  };

  const handleRemoveQuestion = (questionIndex: number) => {
    const currentMCQs = [...watch("snapshotMCQs")];

    if (currentMCQs.length === 1) {
      toast.error("At least one question is required");
      return;
    }

    currentMCQs.splice(questionIndex, 1);
    setValue("snapshotMCQs", currentMCQs, { shouldDirty: true });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const currentMCQs = [...watch("snapshotMCQs")];
    const currentOptions = [...currentMCQs[questionIndex].options];

    if (
      currentMCQs[questionIndex].correctAnswer === currentOptions[optionIndex]
    ) {
      currentMCQs[questionIndex].correctAnswer =
        currentOptions[0] !== currentOptions[optionIndex]
          ? currentOptions[0]
          : currentOptions[1] || "";
    }

    currentOptions.splice(optionIndex, 1);
    currentMCQs[questionIndex].options = currentOptions;
    setValue("snapshotMCQs", currentMCQs, { shouldDirty: true });
  };

  const handleAddOption = (questionIndex: number) => {
    const currentMCQs = [...watch("snapshotMCQs")];
    const currentOptions = [...currentMCQs[questionIndex].options];
    currentOptions.push("");
    currentMCQs[questionIndex].options = currentOptions;
    setValue("snapshotMCQs", currentMCQs);
  };

  if (!data) {
    return <div>Loading consent form...</div>;
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {/* <MoveLeft
        size={20}
        className="cursor-pointer"
        onClick={() => router.back()}
      /> */}

      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(handleSaveDraft)}
          className="flex flex-col gap-6"
        >
          {/* <div className="py-10 px-10 bg-[#698AFF4D] rounded-lg shadow-sm border border-gray-200 text-lg">
            <div>
              <FormField
                name="patient.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Patient name:{" "}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border rounded px-2 py-1"
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2">
              <FormField
                name="procedure.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Procedure name:{" "}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border rounded px-2 py-1"
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <FormField
                name="expiresAt"
                render={({ field }) => {
                  // Helper function to format Date for datetime-local input
                  const formatDateForInput = (date: Date) => {
                    if (!(date instanceof Date) || isNaN(date.getTime()))
                      return "";

                    const pad = (num: number) =>
                      num.toString().padStart(2, "0");
                    const localDate = new Date(
                      date.getTime() - date.getTimezoneOffset() * 60000
                    );

                    return `${localDate.getFullYear()}-${pad(
                      localDate.getMonth() + 1
                    )}-${pad(localDate.getDate())}T${pad(
                      localDate.getHours()
                    )}:${pad(localDate.getMinutes())}`;
                  };

                  // Get current datetime in local timezone for min attribute
                  const getCurrentLocalDatetime = () => {
                    const now = new Date();
                    const localNow = new Date(
                      now.getTime() - now.getTimezoneOffset() * 60000
                    );
                    return localNow.toISOString().slice(0, 16);
                  };

                  const value =
                    field.value instanceof Date
                      ? formatDateForInput(field.value)
                      : "";

                  return (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Expiration Date:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={value}
                          min={getCurrentLocalDatetime()}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (!newValue) {
                              field.onChange(null);
                              return;
                            }

                            // Convert to Date object in local timezone
                            const localDate = new Date(newValue);
                            const offset =
                              localDate.getTimezoneOffset() * 60000;
                            const adjustedDate = new Date(
                              localDate.getTime() + offset
                            );

                            field.onChange(adjustedDate);
                          }}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <FormField
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </FormControl>
                    <FormLabel className="font-medium">Active Form</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div> */}
          <Card className="overflow-hidden border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 md:py-6 px-4">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-gray-800 h-full">
                <Clock className="h-5 w-5 text-blue-600" />
                Consent Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Patient Name Field */}
                <FormField
                  name="patient.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                        <User className="h-4 w-4 text-blue-600" />
                        Patient Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          className="mt-1 border-gray-300 bg-gray-50 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Procedure Name Field */}
                <FormField
                  name="procedure.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Procedure Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          className="mt-1 border-gray-300 bg-gray-50 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Expiration Date Field */}
              <FormField
                name="expiresAt"
                render={({ field }) => {
                  const value =
                    field.value instanceof Date
                      ? formatDateForInput(field.value)
                      : "";

                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Expiration Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={value}
                          min={getCurrentLocalDatetime()}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (!newValue) {
                              field.onChange(null);
                              return;
                            }

                            // Convert to Date object in local timezone
                            const localDate = new Date(newValue);
                            const offset =
                              localDate.getTimezoneOffset() * 60000;
                            const adjustedDate = new Date(
                              localDate.getTime() + offset
                            );

                            field.onChange(adjustedDate);
                          }}
                          className="mt-1 border-gray-300 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Active Status Field */}
              <FormField
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-gray-100 bg-gray-50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Active Form
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        Enable this to make the procedure active
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* {formMethods.watch("snapshotMCQs")?.length > 0 ? (
                <div>length is greater then 0</div>
              ) : (
                <div>Nothing here</div>
              )} */}
              {formMethods.watch("snapshotMCQs")?.map((mcq, mcqIndex) => {
                return (
                  <div
                    key={mcq.id || mcqIndex}
                    className="p-6 border rounded-lg shadow-sm bg-white relative" // Added 'relative' here
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(mcqIndex)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      disabled={isSubmittingForm}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>

                    <FormField
                      name={`snapshotMCQs.${mcqIndex}.questionText`}
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="font-medium">
                            Question:
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full border rounded px-3 py-2 mt-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <FormLabel className="font-medium">Options:</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddOption(mcqIndex)}
                          className="flex items-center gap-1"
                          disabled={isSubmittingForm}
                        >
                          <Plus className="h-4 w-4" /> Add Option
                        </Button>
                      </div>

                      <FormField
                        name={`snapshotMCQs.${mcqIndex}.correctAnswer`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="space-y-2"
                            >
                              {watch(`snapshotMCQs.${mcqIndex}.options`)?.map(
                                (option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <RadioGroupItem
                                      value={option}
                                      id={`answer-${mcqIndex}-${optionIndex}`}
                                      disabled={isSubmittingForm}
                                    />
                                    <div className="w-6">
                                      <span className="text-md text-gray-500">
                                        {String.fromCharCode(
                                          97 + optionIndex
                                        ).toUpperCase()}
                                        .
                                      </span>
                                    </div>
                                    <FormField
                                      name={`snapshotMCQs.${mcqIndex}.options.${optionIndex}`}
                                      render={({ field: optionField }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              placeholder={`Option ${String.fromCharCode(
                                                97 + optionIndex
                                              ).toUpperCase()}`}
                                              {...optionField}
                                              className="border rounded px-3 py-1"
                                              disabled={isSubmittingForm}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleRemoveOption(
                                          mcqIndex,
                                          optionIndex
                                        )
                                      }
                                      disabled={
                                        watch(
                                          `snapshotMCQs.${mcqIndex}.options`
                                        ).length <= 2 || isSubmittingForm
                                      }
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              )}
                            </RadioGroup>
                            {fieldState.error && (
                              <p className="text-sm font-medium text-destructive">
                                {fieldState.error.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormLabel className="font-medium">Video:</FormLabel>
                      <Controller
                        name={`snapshotMCQs.${mcqIndex}.videoFile`}
                        control={control}
                        render={({ field }) => (
                          <FileUploader
                            onFileUpload={(files) => {
                              if (files && files.length > 0) {
                                field.onChange(files[0]);
                                setValue(
                                  `snapshotMCQs.${mcqIndex}.videoUrl`,
                                  ""
                                );
                              } else {
                                field.onChange(null);
                              }
                            }}
                            showPreview={true}
                            maxFiles={1}
                            text="Upload video"
                            extraText="Drag and drop a video or click to browse"
                            allowedTypes={[
                              "video/mp4",
                              "video/webm",
                              "video/ogg",
                              "video/quicktime",
                            ]}
                            defaultPreview={
                              data?.snapshotMCQs?.[mcqIndex]?.videoUrl ||
                              undefined
                            }
                            defaultName={
                              data?.snapshotMCQs?.[mcqIndex]?.videoName ||
                              undefined
                            }
                            disabled={isSubmittingForm}
                            error={
                              errors.snapshotMCQs?.[mcqIndex]?.videoFile
                                ?.message as string
                            }
                            alwaysShowDropzone={false}
                          />
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dentist/consent-forms")}
                disabled={isSubmittingForm}
              >
                Cancel
              </Button>

              <div className="flex justify-end items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentMCQs = [...watch("snapshotMCQs")];
                    currentMCQs.push({
                      id: `new-question-${Date.now()}`,
                      questionText: "",
                      options: ["", ""],
                      correctAnswer: "",
                      videoUrl: "",
                    });
                    setValue("snapshotMCQs", currentMCQs, {
                      shouldDirty: true,
                    });
                  }}
                  disabled={isSubmittingForm}
                  className="w-full md:w-auto"
                >
                  + Add New Question
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || isSubmittingForm}
                  className="bg-[#698AFF] hover:bg-bg-[#698AFF]"
                >
                  {isSubmittingForm ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">↻</span>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
