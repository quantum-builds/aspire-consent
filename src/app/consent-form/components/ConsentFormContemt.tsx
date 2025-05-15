"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import type { TConsentForm } from "@/types/consent-form";
import {
  useSaveDraftAnswers,
  useSubmitConsentForm,
} from "@/services/consent-form/ConsentFomMutation";
import { useRouter } from "next/navigation";
import getPathAfterUploadsImages from "@/utils/getSplittedPath";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const submitFormSchema = z.object({
  answers: z.record(z.string().min(1, "Answer is required")),
  consent: z.boolean().refine((val) => val, {
    message: "You must consent to the treatment",
  }),
});

interface ConsentFormContentProps {
  data: TConsentForm | null;
  setCurrentPage: Dispatch<SetStateAction<"videos" | "mcqs">>;
  formId: string;
};

const questionVariants = {
  enter: {
    y: 20,
    opacity: 0,
  },
  center: {
    y: 0,
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      y: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
};

export default function ConsentFormContent({
  data,
  formId,
  setCurrentPage,
}: ConsentFormContentProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [answerStatus, setAnswerStatus] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{
    mcqId: string;
    autoplay: boolean;
  } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [jumpToSummary, setJumpToSummary] = useState(false);
  const [showWatchVideo, setShowWatchVideo] = useState(false);

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

  useEffect(() => {
    if (showSummary) {
      const hasFalseValue = Object.values(answerStatus).some(
        (value) => value === false
      );
      setShowWatchVideo(hasFalseValue);
    }
  }, [showSummary]);

  const allCorrect = Object.values(answerStatus).every(Boolean);
  const currentMcq = data?.snapshotMCQs?.[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === (data?.snapshotMCQs?.length ?? 0) - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const totalQuestions = data?.snapshotMCQs?.length ?? 0;
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

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

  const goToNextQuestion = () => {
    if (!data?.snapshotMCQs) return;
    const nextIndex = currentQuestionIndex + 1;
    if (jumpToSummary) {
      setShowSummary(true);
      setJumpToSummary(false);
    } else if (nextIndex < data.snapshotMCQs.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentVideo(null);
    } else {
      setShowSummary(true);
    }
  };

  const goToPrevQuestion = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }

    if (!data?.snapshotMCQs) return;
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
      setCurrentVideo(null);
    }
  };

  const getAnswerStatusIcon = (mcqId: string) => {
    if (!answers[mcqId]) return null;

    if (answerStatus[mcqId]) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  if (!data || !currentMcq) {
    return <div className="p-6 text-center">No Questionnaires Added</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen 2xl:pt-12">
      {/* Main content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col gap-5">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1 min-h-[50vh]">
            <AnimatePresence mode="wait">
              {showSummary ? (
                <motion.div
                  key="summary"
                  variants={questionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className=""
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Review Your Answers
                  </h2>

                  <div className="space-y-4 mb-8">
                    {data.snapshotMCQs.map((mcq, index) => (
                      <motion.div
                        key={mcq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border ${
                          !answers[mcq.id]
                            ? "border-gray-200 "
                            : answerStatus[mcq.id]
                            ? "border-green-200 "
                            : "border-red-200 "
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                Question {index + 1}:
                              </span>
                              {getAnswerStatusIcon(mcq.id)}
                            </div>
                            <p className="mt-1 text-gray-600">
                              {mcq.questionText}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentQuestionIndex(index);
                              setShowSummary(false);
                              setJumpToSummary(true);
                            }}
                            className="text-indigo-600 hover:bg-indigo-50"
                          >
                            Edit
                          </Button>
                        </div>
                        {answers[mcq.id] && (
                          <div className="mt-2 pl-4">
                            <span className="text-sm text-gray-500">
                              Your answer:{" "}
                            </span>
                            <span className="text-sm font-medium">
                              {answers[mcq.id]}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Consent checkbox */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: data.snapshotMCQs.length * 0.05 + 0.1,
                    }}
                    className="p-4 border border-indigo-200 rounded-lg bg-indigo-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center cursor-pointer ${
                          consent
                            ? "border-indigo-600 bg-indigo-100"
                            : "border-gray-300 bg-white"
                        }`}
                        onClick={() => setConsent(!consent)}
                      >
                        {consent && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <label
                        className="text-sm text-gray-700 cursor-pointer"
                        onClick={() => setConsent(!consent)}
                      >
                        I understand the information provided about{" "}
                        <span className="font-medium text-indigo-700">
                          {data.procedure.name}
                        </span>{" "}
                        and consent to the treatment.
                      </label>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key={`question-${currentQuestionIndex}`}
                  variants={questionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className=""
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {currentMcq.questionText}
                  </h3>

                  <RadioGroup
                    value={answers[currentMcq.id] || ""}
                    onValueChange={(value) =>
                      handleAnswerSelect(currentMcq.id, value)
                    }
                    className="space-y-3"
                  >
                    {currentMcq.options.map((option, index) => {
                      const letter = String.fromCharCode(65 + index);
                      const isSelected = answers[currentMcq.id] === option;

                      return (
                        <motion.div
                          key={`${currentMcq.id}-${option}`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`relative overflow-hidden rounded-lg border transition-all ${
                            isSelected
                              ? "border-indigo-300  ring-1 ring-indigo-200"
                              : "border-gray-300 hover:border-indigo-300 "
                          }`}
                        >
                          <label
                            htmlFor={`${currentMcq.id}-${option}`}
                            className="flex items-center gap-4 p-4 cursor-pointer relative z-10"
                          >
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium ${
                                isSelected
                                  ? "bg-indigo-600 text-white"
                                  : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {letter}
                            </div>
                            <RadioGroupItem
                              value={option}
                              id={`${currentMcq.id}-${option}`}
                              className="sr-only"
                            />
                            <span className="flex-1 text-gray-700">
                              {option}
                            </span>
                            {isSelected && (
                              <div className="flex-shrink-0">
                                <Check className="h-5 w-5 text-indigo-600" />
                              </div>
                            )}
                          </label>
                        </motion.div>
                      );
                    })}
                  </RadioGroup>

                  {currentVideo?.mcqId === currentMcq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-4 border-t border-gray-200 overflow-hidden"
                    >
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Video:{" "}
                        {getPathAfterUploadsImages(
                          currentMcq.videoName ||
                            "/uploads/aspire-consent/placeholder.mp4"
                        ) || "Explanation"}
                      </h4>
                      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <iframe
                          src={`${currentMcq.videoUrl}${
                            currentVideo.autoplay ? "?autoplay=1" : ""
                          }`}
                          className="w-full aspect-video"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation footer */}
          <div className="mt-6 flex justify-between items-center">
            <div>
              {showWatchVideo && showSummary && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 text-indigo-700 border-indigo-300 hover:bg-indigo-5 cursor-pointer"
                  onClick={() => setCurrentPage("videos")}
                >
                  <Play className="w-4 h-4" />
                  Watch video
                </Button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center md:justify-end md:flex-row gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="text-indigo-600 border-indigo-300 hover:bg-indigo-50 order-2 md:order-1"
              >
                {isSavingDraft ? "Saving..." : "Save Progress"}
              </Button>
              <div className="flex gap-3 order-1 md:order-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevQuestion}
                  disabled={isFirstQuestion && !showSummary}
                  className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {showSummary ? "Back to Questions" : "Previous"}
                </Button>

                {showSummary ? (
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={!allCorrect || !consent || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Form"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextQuestion}
                    disabled={!answers[currentMcq.id]}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isLastQuestion || jumpToSummary
                      ? "Review Answers"
                      : "Next"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                {showSummary
                  ? "Review Answers"
                  : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
              </span>

              {!showSummary && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-indigo-50 text-indigo-500"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 shadow-sm max-w-xs">
                      <p className="text-gray-700">
                        Answer all questions correctly to proceed. You can watch
                        the video for help.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {!showSummary && (
            <div className="mt-3 relative h-2 bg-indigo-100 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
