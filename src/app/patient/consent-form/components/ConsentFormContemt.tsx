"use client";

import { useState, useEffect } from "react";
import { Check, X, Play } from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { PatientInputConsentForm } from "@/types/consent-form";
import {
  useSaveDraftAnswers,
  useSubmitConsentForm,
} from "@/services/consent-form/ConsentFomMutation";
import { useRouter, useSearchParams } from "next/navigation";
import getPathAfterUploadsImages from "@/utils/getSplittedPath";
import { useSession } from "next-auth/react";

// Schema validation
const submitFormSchema = z.object({
  answers: z.record(z.string().min(1, "Answer is required")),
  consent: z.boolean().refine((val) => val, {
    message: "You must consent to the treatment",
  }),
});

type ConsentFormContentProps = {
  data: PatientInputConsentForm | null;
  formId: string;
};

export default function ConsentFormContent({
  data,
  formId,
}: ConsentFormContentProps) {
  // State management
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user;
  if (token?.email !== email) {
    router.replace("/unauthorize");
  }

  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [answerStatus, setAnswerStatus] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<{
    mcqId: string;
    autoplay: boolean;
  } | null>(null);

  // Mutations
  const { mutate: saveDraft, isPending: isSavingDraft } = useSaveDraftAnswers();
  const { mutate: submitForm, isPending: isSubmitting } =
    useSubmitConsentForm();

  // Initialize answers with default values from data
  useEffect(() => {
    if (data?.snapshotMCQs) {
      const initialAnswers = data.snapshotMCQs.reduce((acc, mcq) => {
        const existingAnswer = data.answers?.find(
          (a) => a.mcqSnapshotId === mcq.id
        );
        acc[mcq.id] = existingAnswer?.selectedAnswer || null;
        return acc;
      }, {} as Record<string, string | null>);

      setAnswers(initialAnswers);

      const initialStatus = data.snapshotMCQs.reduce((acc, mcq) => {
        const existingAnswer = data.answers?.find(
          (a) => a.mcqSnapshotId === mcq.id
        );
        acc[mcq.id] = existingAnswer
          ? existingAnswer.selectedAnswer === mcq.correctAnswer
          : false;
        return acc;
      }, {} as Record<string, boolean>);

      setAnswerStatus(initialStatus);

      const hasAnswers = data.answers && data.answers.length > 0;
      const allCorrect = Object.values(initialStatus).every(Boolean);
      setConsent(hasAnswers && allCorrect);
    }
  }, [data]);

  // Check if all answers are correct
  const allCorrect = Object.values(answerStatus).every(Boolean);

  const handleAnswerSelect = (mcqId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [mcqId]: answer }));
    // Remove the status for this question when selecting a new answer
    setAnswerStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[mcqId];
      return newStatus;
    });
  };

  const checkAnswer = (mcqId: string) => {
    const mcq = data?.snapshotMCQs.find((q) => q.id === mcqId);
    if (!mcq || answers[mcqId] === null) return;

    const isCorrect = answers[mcqId] === mcq.correctAnswer;
    setAnswerStatus((prev) => ({ ...prev, [mcqId]: isCorrect }));
  };

  const handleSaveDraft = () => {
    // Only save answers that have values
    const draftAnswers = Object.entries(answers)
      .filter(([, answer]) => answer !== null)
      .map(([mcqId, selectedAnswer]) => ({
        mcqId,
        selectedAnswer: selectedAnswer as string,
      }));

    saveDraft(
      { formId, answers: draftAnswers },
      {
        onSuccess: () => {
          toast.success("Draft saved successfully");
          router.replace("/patient/dashboard");
        },
        onError: () => toast.error("Failed to save draft"),
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data for submission
      const formData = submitFormSchema.parse({
        answers: Object.fromEntries(
          Object.entries(answers).map(([key, value]) => [
            key,
            value || "", // Convert null to empty string for validation
          ])
        ),
        consent,
      });

      // Validate all answers are correct
      if (!allCorrect) {
        toast.error("Please correct all wrong answers before submitting");
        return;
      }

      // Convert answers to array format expected by the API
      const formAnswers = Object.entries(formData.answers).map(
        ([mcqId, selectedAnswer]) => ({
          mcqId,
          selectedAnswer,
        })
      );

      // Submit form
      submitForm(
        { formId, answers: formAnswers },
        {
          onSuccess: () => {
            toast.success("Form submitted successfully!");
            router.replace("/patient/dashboard");
          },
          onError: () => toast.error("Failed to submit form"),
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Form submission error:", error);
      }
    }
  };

  if (!data) {
    return <div className="p-6 text-center">Loading consent form...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-xl font-medium text-gray-800 mb-2">
        Consent Form: {data.procedure.name}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Please answer all questions correctly to proceed with the consent form.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {data.snapshotMCQs.map((mcq) => (
            <div
              key={mcq.id}
              className={`p-4 border rounded-md ${
                activeQuestion === mcq.id
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : answerStatus[mcq.id]
                  ? "border-green-200 bg-green-50"
                  : answers[mcq.id] !== null && !answerStatus[mcq.id]
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200"
              }`}
              onClick={() => setActiveQuestion(mcq.id)}
            >
              <p className="font-medium text-gray-700 mb-3">
                Q: {mcq.questionText}
              </p>

              <div className="space-y-2">
                {mcq.options.map((option, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={`${mcq.id}-${option}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {String.fromCharCode(97 + index).toUpperCase()}.
                      </span>
                      <span className="text-gray-600">{option}</span>
                    </div>
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${
                        answers[mcq.id] === option
                          ? answerStatus[mcq.id] !== undefined
                            ? answerStatus[mcq.id]
                              ? "bg-green-100 border-green-400"
                              : "bg-red-100 border-red-400"
                            : "bg-blue-50 border-blue-300"
                          : "border-gray-300"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswerSelect(mcq.id, option);
                      }}
                    >
                      {answers[mcq.id] === option &&
                        answerStatus[mcq.id] !== undefined &&
                        (answerStatus[mcq.id] ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <div className="text-sm">
                  {answerStatus[mcq.id] !== undefined && answers[mcq.id] && (
                    <span
                      className={
                        answerStatus[mcq.id] ? "text-green-600" : "text-red-600"
                      }
                    >
                      {answerStatus[mcq.id] ? "Correct" : "Incorrect"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentVideo?.mcqId === mcq.id ? (
                    <button
                      type="button"
                      className="text-sm text-blue-500 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentVideo(null);
                      }}
                    >
                      Hide video
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentVideo({ mcqId: mcq.id, autoplay: false });
                      }}
                    >
                      <Play className="w-3 h-3" /> Watch video
                    </button>
                  )}

                  {answers[mcq.id] && answerStatus[mcq.id] === undefined && (
                    <button
                      type="button"
                      className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        checkAnswer(mcq.id);
                      }}
                    >
                      Check
                    </button>
                  )}
                </div>
              </div>

              {currentVideo?.mcqId === mcq.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Educational Video:
                    {getPathAfterUploadsImages(
                      mcq.videoName || "/uploads/aspire-consent/placeholder.mp4"
                    ) || "Explanation"}
                  </h4>
                  <iframe
                    src={`${mcq.videoUrl}${
                      currentVideo.autoplay ? "?autoplay=1" : ""
                    }`}
                    className="w-full aspect-video rounded"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 flex items-start gap-2">
            <div
              className={`mt-0.5 w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center cursor-pointer ${
                consent ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onClick={() => setConsent(!consent)}
            >
              {consent && <Check className="w-4 h-4 text-blue-600" />}
            </div>
            <label
              className="text-sm text-gray-600 cursor-pointer"
              onClick={() => setConsent(!consent)}
            >
              I understand the information provided and consent to the
              treatment.
            </label>
          </div>

          <div className="flex justify-between gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
            >
              {isSavingDraft ? "Saving..." : "Save Progress"}
            </button>
            <div className="flex gap-2">
              {!allCorrect && (
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    Object.keys(answers).forEach((mcqId) => {
                      if (!answerStatus[mcqId] && answers[mcqId]) {
                        checkAnswer(mcqId);
                      }
                    });
                  }}
                >
                  Check Answers
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!allCorrect || !consent || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
