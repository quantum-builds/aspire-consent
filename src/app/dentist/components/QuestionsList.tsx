"use client";
import { ConsentFormMCQSnapshot } from "@/types/consent-form";
import { ExtendedTMCQ } from "@/types/mcq";
import getPathAfterUploadsImages from "@/utils/getSplittedPath";
import { Play } from "lucide-react";
import { useState } from "react";

interface QuestionsListProps {
  data: ConsentFormMCQSnapshot[] | ExtendedTMCQ[];
  answers: Record<string, string | null> | null;
  isProcedure: boolean;
}
export default function QuestionsList({
  data,
  answers,
  isProcedure = false,
}: QuestionsListProps) {
  const [currentVideo, setCurrentVideo] = useState<{
    mcqId: string;
    autoplay: boolean;
  } | null>(null);
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {data?.length ? (
        <div className="space-y-6">
          {data.map((mcq) => {
            const userAnswer = answers ? answers[mcq.id] : null;
            const isUnanswered = userAnswer === null;

            // For procedure, we don't care about correctness
            const isCorrect = isProcedure
              ? false
              : !isUnanswered &&
                userAnswer?.trim().toLowerCase() ===
                  mcq.correctAnswer?.trim().toLowerCase();

            return (
              <div
                key={mcq.id}
                className={`p-4 border rounded-md ${
                  isUnanswered && !isProcedure
                    ? "border-yellow-400 bg-yellow-50"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-700 mb-3">
                    Q: {mcq.questionText}
                  </p>
                  {isUnanswered && !isProcedure && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-200 text-yellow-800 rounded-md">
                      Unanswered
                    </span>
                  )}
                </div>

                <div className="space-y-2 ">
                  {(mcq.options || []).map((option: string, index: number) => {
                    // Normalize both the option and correct answer for comparison
                    const normalizedOption = option?.trim().toLowerCase();
                    const normalizedCorrect = mcq.correctAnswer
                      ?.trim()
                      .toLowerCase();
                    const isThisOptionCorrect =
                      normalizedOption === normalizedCorrect;
                    const isUserAnswerThisOption =
                      !isUnanswered &&
                      userAnswer?.trim().toLowerCase() === normalizedOption;

                    return (
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
                          className={`w-5 h-5 border rounded flex items-center justify-center`}
                        >
                          {isProcedure ? (
                            // For procedure, just show tick for correct answer
                            isThisOptionCorrect && (
                              <span className="text-green-600">✓</span>
                            )
                          ) : (
                            // Original logic for non-procedure
                            <>
                              {isUserAnswerThisOption &&
                                (isCorrect ? (
                                  <span className="text-green-600">✓</span>
                                ) : (
                                  <span className="text-red-600">✗</span>
                                ))}
                              {isThisOptionCorrect &&
                                !isUserAnswerThisOption &&
                                !isUnanswered && (
                                  <span className="text-green-600">✓</span>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-4">
                  <div className="text-sm">
                    {isProcedure ? (
                      <p>Correct answer: {mcq.correctAnswer}</p>
                    ) : isUnanswered ? (
                      <p>
                        <span className="text-yellow-600">
                          Please answer this question
                        </span>{" "}
                        <span>Answer is : {mcq.correctAnswer}</span>
                      </p>
                    ) : (
                      <span
                        className={
                          isCorrect ? "text-green-600" : "text-red-600"
                        }
                      >
                        {isCorrect
                          ? "Your answer is correct"
                          : `Correct answer: ${mcq.correctAnswer}`}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentVideo?.mcqId === mcq.id ? (
                      <button
                        type="button"
                        className="text-sm text-blue-500 hover:underline"
                        onClick={() => setCurrentVideo(null)}
                      >
                        Hide video
                      </button>
                    ) : (
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
                    )}
                  </div>
                </div>

                {currentVideo && currentVideo?.mcqId === mcq.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Video:
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
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-red-500">
          No MCQs found in this consent form
        </div>
      )}
    </div>
  );
}
