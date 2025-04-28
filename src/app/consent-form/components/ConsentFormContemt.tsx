"use client";
import { useState, useEffect } from "react";
import { Check, X, Play } from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { TConsentForm } from "@/types/consent-form";
import {
  useSaveDraftAnswers,
  useSubmitConsentForm,
} from "@/services/consent-form/ConsentFomMutation";
import { useRouter } from "next/navigation";
import getPathAfterUploadsImages from "@/utils/getSplittedPath";
import Image from "next/image";
import { AspireConsentBlackLogo } from "@/asssets";

const submitFormSchema = z.object({
  answers: z.record(z.string().min(1, "Answer is required")),
  consent: z.boolean().refine((val) => val, {
    message: "You must consent to the treatment",
  }),
});

type ConsentFormContentProps = {
  data: TConsentForm | null;
  formId: string;
};

export default function ConsentFormContent({
  data,
  formId,
}: ConsentFormContentProps) {
  const router = useRouter();
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

  const allCorrect = Object.values(answerStatus).every(Boolean);

  const handleAnswerSelect = (mcqId: string, answer: string) => {
    const mcq = data?.snapshotMCQs.find((q) => q.id === mcqId);
    if (!mcq) return;
    const isCorrect = answer === mcq.correctAnswer;
    setAnswers((prev) => ({ ...prev, [mcqId]: answer }));
    setAnswerStatus((prev) => ({ ...prev, [mcqId]: isCorrect }));
  };

  const handleSaveDraft = () => {
    const draftAnswers = Object.entries(answers)
      .filter(([, answer]) => answer !== null)
      .map(([mcqId, selectedAnswer]) => ({
        mcqId,
        selectedAnswer: selectedAnswer as string,
      }));

    saveDraft(
      { role: "patient", formId, answers: draftAnswers },
      {
        onSuccess: () => {
          toast.success("Draft saved successfully");
          router.replace("/form-save");
        },
        onError: () => toast.error("Failed to save draft"),
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = submitFormSchema.parse({
        answers: Object.fromEntries(
          Object.entries(answers).map(([key, value]) => [key, value || ""])
        ),
        consent,
      });

      if (!allCorrect) {
        toast.error("Please correct all wrong answers before submitting");
        return;
      }

      const formAnswers = Object.entries(formData.answers).map(
        ([mcqId, selectedAnswer]) => ({
          mcqId,
          selectedAnswer,
        })
      );

      submitForm(
        { role: "patient", formId, answers: formAnswers },
        {
          onSuccess: () => {
            toast.success("Form submitted successfully!");
            router.replace("/form-success");
          },
          onError: () => toast.error("Failed to submit form"),
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
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
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      <Image
        src={AspireConsentBlackLogo || "/placeholder.svg"}
        alt="Aspire Logo"
        width={140}
        className="object-contain"
        priority
      />
      <div className="py-10 px-10 bg-[#698AFF4D] rounded-lg shadow-sm border border-gray-200 text-lg">
        Hi {data.patient.fullName}, You&apos;ve scheduled a
        <span className="font-semibold"> {data.procedure.name}</span>! Please
        take a moment to complete this short quiz to help you better understand
        the procedure and what to expect. If you&apos;re unsure about any
        answer, feel free to watch the provided video.
      </div>
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {data.snapshotMCQs.map((mcq) => (
              <div
                key={mcq.id}
                className={`p-4 border rounded-md ${
                  activeQuestion === mcq.id
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : answers[mcq.id]
                    ? answerStatus[mcq.id]
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white"
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
                            ? answerStatus[mcq.id]
                              ? "bg-green-100 border-green-400"
                              : "bg-red-100 border-red-400"
                            : "border-gray-300 bg-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnswerSelect(mcq.id, option);
                        }}
                      >
                        {answers[mcq.id] === option &&
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
                    {answers[mcq.id] && (
                      <span
                        className={
                          answerStatus[mcq.id]
                            ? "text-green-600"
                            : "text-red-600"
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
                  </div>
                </div>
                {currentVideo?.mcqId === mcq.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Educational Video:{" "}
                      {getPathAfterUploadsImages(
                        mcq.videoName ||
                          "/uploads/aspire-consent/placeholder.mp4"
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
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
              >
                {isSavingDraft ? "Saving..." : "Save Progress"}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!allCorrect || !consent || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
