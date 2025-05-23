"use client";

import { TConsentForm } from "@/types/consent-form";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useSaveDraftAnswers } from "@/services/consent-form/ConsentFomMutation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConsentFormEditorHeader from "./ConsentFormEditorHeader";
import MCQEditor from "@/app/dentist/components/QuestionCard";

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
  mcqs: z.array(
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
  mcqs: {
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

export default function ConsentFormEditor({ data, formId }: ConsentFormProps) {
  const router = useRouter();

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: { fullName: data?.patient?.fullName || "" },
      procedure: { name: data?.procedure?.name || "" },
      expiresAt: data?.expiresAt ? new Date(data.expiresAt) : new Date(),
      isActive: data?.isActive ?? true,
      mcqs: data?.snapshotMCQs?.length
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
    formState: { isDirty },
    reset,
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
        mcqs: data.snapshotMCQs?.length
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
    const hasValidQuestions = formData.mcqs.some(
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

    const mcqUpdates = formData.mcqs.map((mcq) => {
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

  // Create default video preview data for the MCQEditor
  const defaultVideoUrls: { [key: string]: string | undefined } = {};
  const defaultVideoNames: { [key: string]: string | undefined } = {};

  data?.snapshotMCQs?.forEach((mcq, index) => {
    defaultVideoUrls[index] = mcq.videoUrl;
    defaultVideoNames[index] = mcq.videoName;
  });

  if (!data) {
    return <div>Loading consent form...</div>;
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(handleSaveDraft)}
          className="flex flex-col gap-6"
        >
          <ConsentFormEditorHeader />

          <div className="py-4">
            <MCQEditor
              basePath="mcqs"
              isSubmitting={isSubmittingForm}
              defaultVideoUrls={defaultVideoUrls}
              defaultVideoNames={defaultVideoNames}
            />

            <div className="mt-6 flex justify-end">
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
        </form>
      </FormProvider>
    </div>
  );
}
