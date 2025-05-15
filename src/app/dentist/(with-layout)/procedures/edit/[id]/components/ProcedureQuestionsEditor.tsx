"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ExtendedTMCQ } from "@/types/mcq";
import ProcedureQuestionEditorHeader from "./ProcedureQuestionEditorHeader";
import { usePatchProcedure } from "@/services/procedure/ProcedureMutation";
import MCQEditor from "@/app/dentist/components/QuestionCard";

const formSchema = z.object({
  name: z.string().min(1, "Procedure name is required"),
  description: z.string().optional(),
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
  name: string;
  description?: string;
  mcqs: {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    videoUrl?: string;
    videoFile?: File | string;
  }[];
};

interface ProcedureQuestionsProps {
  data: ExtendedTMCQ[];
  formId: string;
}

export default function ProcedureQuestionsEditor({
  data,
  formId,
}: ProcedureQuestionsProps) {
  const router = useRouter();

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.length > 0 ? data[0].procedure.name : "",
      description: data.length > 0 ? data[0].procedure.description : "",
      mcqs: data.length
        ? data.map((mcq) => ({
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

  const { mutate: saveMCQs, isPending: isSavingMCQs } = usePatchProcedure();
  const isSubmittingForm = isSavingMCQs;

  useEffect(() => {
    if (data) {
      reset({
        name: data[0]?.procedure.name || "",
        description: data[0]?.procedure.description || "",
        mcqs: data.length
          ? data.map((mcq) => ({
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

    saveMCQs(
      {
        name: formData.name,
        description: formData.description,
        procedureId: formId,
        mcqs: mcqUpdates,
      },
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

  data?.forEach((mcq, index) => {
    defaultVideoUrls[index] = mcq.videoUrl;
    defaultVideoNames[index] = mcq.videoName;
  });

  if (!data) {
    return <div>Loading procedure data...</div>;
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(handleSaveDraft)}
          className="flex flex-col gap-6"
        >
          <ProcedureQuestionEditorHeader />

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
