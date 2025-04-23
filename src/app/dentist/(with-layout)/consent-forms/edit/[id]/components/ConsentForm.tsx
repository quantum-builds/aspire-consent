"use client";

import { TConsentForm } from "@/types/consent-form";
import { MoveLeft, Play, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AspireConsentBlackLogo } from "@/asssets";
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
  const [currentVideo, setCurrentVideo] = useState<{
    mcqId: string;
    autoplay: boolean;
  } | null>(null);

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: { fullName: data?.patient?.fullName || "" },
      procedure: { name: data?.procedure?.name || "" },
      expiresAt: data?.expiresAt ? new Date(data.expiresAt) : new Date(),
      isActive: data?.isActive ?? true,
      snapshotMCQs:
        data?.snapshotMCQs?.map((mcq) => ({
          id: mcq.id,
          questionText: mcq.questionText,
          options: mcq.options || [],
          correctAnswer: mcq.correctAnswer,
          videoUrl: mcq.videoName,
          videoFile: mcq.videoUrl || undefined,
        })) || [],
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
        snapshotMCQs:
          data.snapshotMCQs?.map((mcq) => ({
            id: mcq.id,
            questionText: mcq.questionText,
            options: mcq.options || [],
            correctAnswer: mcq.correctAnswer,
            videoUrl: mcq.videoName,
            videoFile: mcq.videoUrl || undefined,
          })) || [],
      });
    }
  }, [data, reset]);

  const handleSaveDraft = (formData: FormValues) => {
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
      <div className="flex flex-row gap-6 items-center">
        <MoveLeft
          size={30}
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        <Image
          src={AspireConsentBlackLogo || "/placeholder.svg"}
          alt="Aspire Logo"
          width={140}
          className="object-contain"
          priority
        />
      </div>

      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(handleSaveDraft)}
          className="flex flex-col gap-6"
        >
          <div className="py-10 px-10 bg-[#698AFF4D] rounded-lg shadow-sm border border-gray-200 text-lg">
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
                  const formatDateForInput = (date: Date) => {
                    const pad = (num: number) =>
                      num.toString().padStart(2, "0");
                    return `${date.getFullYear()}-${pad(
                      date.getMonth() + 1
                    )}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
                      date.getMinutes()
                    )}`;
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
                          onChange={(e) => {
                            field.onChange(
                              e.target.value ? new Date(e.target.value) : null
                            );
                          }}
                          className="border rounded px-2 py-1"
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
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formMethods.watch("snapshotMCQs")?.map((mcq, mcqIndex) => {
                const videoUrl = watch(`snapshotMCQs.${mcqIndex}.videoUrl`);
                const videoFile = watch(`snapshotMCQs.${mcqIndex}.videoFile`);

                const hasVideo = Boolean(videoFile || videoUrl);
                const isNewVideo = videoFile instanceof File;

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

                    <div className="space-y-2 mt-4">
                      <FormLabel className="block text-gray-700 mb-1">
                        Options:
                      </FormLabel>
                      {watch(`snapshotMCQs.${mcqIndex}.options`)?.map(
                        (_option, optionIndex) => (
                          <div
                            className="flex items-center gap-2"
                            key={`${mcq.id}-${optionIndex}`}
                          >
                            <span className="text-gray-600 w-6">
                              {String.fromCharCode(
                                97 + optionIndex
                              ).toUpperCase()}
                              .
                            </span>
                            <FormField
                              name={`snapshotMCQs.${mcqIndex}.options.${optionIndex}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="border rounded px-3 py-1 flex-1"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveOption(mcqIndex, optionIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                              disabled={
                                isSubmittingForm ||
                                watch(`snapshotMCQs.${mcqIndex}.options`)
                                  .length <= 2
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddOption(mcqIndex)}
                        className="mt-2"
                        disabled={isSubmittingForm}
                      >
                        + Add Option
                      </Button>
                    </div>

                    <div className="mt-4">
                      <FormField
                        name={`snapshotMCQs.${mcqIndex}.correctAnswer`}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel className="font-medium">
                              Correct Answer:
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-1 mt-2"
                              >
                                {watch(`snapshotMCQs.${mcqIndex}.options`)?.map(
                                  (option, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <RadioGroupItem
                                        value={option}
                                        id={`answer-${mcqIndex}-${optionIndex}`}
                                        disabled={isSubmittingForm}
                                      />
                                      <FormLabel
                                        htmlFor={`answer-${mcqIndex}-${optionIndex}`}
                                        className="font-normal"
                                      >
                                        {option}
                                      </FormLabel>
                                    </div>
                                  )
                                )}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormLabel className="font-medium">
                        Educational Video:
                      </FormLabel>
                      {/* <Controller
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
                              data.snapshotMCQs[mcqIndex].videoUrl
                            }
                            defaultName={data.snapshotMCQs[mcqIndex].videoName}
                            disabled={isSubmittingForm}
                            error={
                              errors.snapshotMCQs?.[mcqIndex]?.videoFile
                                ?.message as string
                            }
                            alwaysShowDropzone={false}
                          />
                        )}
                      /> */}
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

                    {/* {hasVideo && !isNewVideo && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Current Video:
                          </h4>
                          <button
                            type="button"
                            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                            onClick={() =>
                              setCurrentVideo({
                                mcqId: mcq.id,
                                autoplay: false,
                              })
                            }
                          >
                            <Play className="w-3 h-3" /> Watch video
                          </button>
                        </div>
                        {currentVideo?.mcqId === mcq.id && (
                          <iframe
                            src={`${videoUrl}${
                              currentVideo.autoplay ? "?autoplay=1" : ""
                            }`}
                            className="w-full aspect-video rounded"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        )}
                      </div>
                    )} */}
                    {hasVideo && !isNewVideo && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Current Video:
                          </h4>
                          <button
                            type="button"
                            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                            onClick={() =>
                              setCurrentVideo({
                                mcqId: mcq.id,
                                autoplay: false,
                              })
                            }
                          >
                            <Play className="w-3 h-3" /> Watch video
                          </button>
                        </div>
                        {currentVideo?.mcqId === mcq.id && videoUrl && (
                          <iframe
                            src={`${videoUrl}${
                              currentVideo.autoplay ? "?autoplay=1" : ""
                            }`}
                            className="w-full aspect-video rounded"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
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
                  setValue("snapshotMCQs", currentMCQs);
                }}
                disabled={isSubmittingForm}
                className="w-full md:w-auto"
              >
                + Add New Question
              </Button>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dentist/consent-forms")}
                disabled={isSubmittingForm}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={!isDirty || isSubmittingForm}>
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
        </form>
      </FormProvider>
    </div>
  );
}
