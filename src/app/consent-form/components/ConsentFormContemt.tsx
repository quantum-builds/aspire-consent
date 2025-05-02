// "use client";
// import { useState, useEffect } from "react";
// import { Check, X, Play } from "lucide-react";
// import { z } from "zod";
// import { toast } from "react-hot-toast";
// import { TConsentForm } from "@/types/consent-form";
// import {
//   useSaveDraftAnswers,
//   useSubmitConsentForm,
// } from "@/services/consent-form/ConsentFomMutation";
// import { useRouter } from "next/navigation";
// import getPathAfterUploadsImages from "@/utils/getSplittedPath";
// import Image from "next/image";
// import { AspireConsentBlackLogo } from "@/asssets";

// const submitFormSchema = z.object({
//   answers: z.record(z.string().min(1, "Answer is required")),
//   consent: z.boolean().refine((val) => val, {
//     message: "You must consent to the treatment",
//   }),
// });

// type ConsentFormContentProps = {
//   data: TConsentForm | null;
//   formId: string;
// };

// export default function ConsentFormContent({
//   data,
//   formId,
// }: ConsentFormContentProps) {
//   const router = useRouter();
//   const [answers, setAnswers] = useState<Record<string, string | null>>({});
//   const [answerStatus, setAnswerStatus] = useState<Record<string, boolean>>({});
//   const [consent, setConsent] = useState(false);
//   const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
//   const [currentVideo, setCurrentVideo] = useState<{
//     mcqId: string;
//     autoplay: boolean;
//   } | null>(null);

//   // Mutations
//   const { mutate: saveDraft, isPending: isSavingDraft } = useSaveDraftAnswers();
//   const { mutate: submitForm, isPending: isSubmitting } =
//     useSubmitConsentForm();

//   useEffect(() => {
//     if (data?.snapshotMCQs) {
//       const initialAnswers = data.snapshotMCQs.reduce((acc, mcq) => {
//         const existingAnswer = data.answers?.find(
//           (a) => a.mcqSnapshotId === mcq.id
//         );
//         acc[mcq.id] = existingAnswer?.selectedAnswer || null;
//         return acc;
//       }, {} as Record<string, string | null>);
//       setAnswers(initialAnswers);

//       const initialStatus = data.snapshotMCQs.reduce((acc, mcq) => {
//         const existingAnswer = data.answers?.find(
//           (a) => a.mcqSnapshotId === mcq.id
//         );
//         acc[mcq.id] = existingAnswer
//           ? existingAnswer.selectedAnswer === mcq.correctAnswer
//           : false;
//         return acc;
//       }, {} as Record<string, boolean>);
//       setAnswerStatus(initialStatus);

//       const hasAnswers = data.answers && data.answers.length > 0;
//       const allCorrect = Object.values(initialStatus).every(Boolean);
//       setConsent(hasAnswers && allCorrect);
//     }
//   }, [data]);

//   const allCorrect = Object.values(answerStatus).every(Boolean);

//   const handleAnswerSelect = (mcqId: string, answer: string) => {
//     const mcq = data?.snapshotMCQs.find((q) => q.id === mcqId);
//     if (!mcq) return;
//     const isCorrect = answer === mcq.correctAnswer;
//     setAnswers((prev) => ({ ...prev, [mcqId]: answer }));
//     setAnswerStatus((prev) => ({ ...prev, [mcqId]: isCorrect }));
//   };

//   const handleSaveDraft = () => {
//     const draftAnswers = Object.entries(answers)
//       .filter(([, answer]) => answer !== null)
//       .map(([mcqId, selectedAnswer]) => ({
//         mcqId,
//         selectedAnswer: selectedAnswer as string,
//       }));

//     saveDraft(
//       { role: "patient", formId, answers: draftAnswers },
//       {
//         onSuccess: () => {
//           toast.success("Draft saved successfully");
//           router.replace("/form-save");
//         },
//         onError: () => toast.error("Failed to save draft"),
//       }
//     );
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = submitFormSchema.parse({
//         answers: Object.fromEntries(
//           Object.entries(answers).map(([key, value]) => [key, value || ""])
//         ),
//         consent,
//       });

//       if (!allCorrect) {
//         toast.error("Please correct all wrong answers before submitting");
//         return;
//       }

//       const formAnswers = Object.entries(formData.answers).map(
//         ([mcqId, selectedAnswer]) => ({
//           mcqId,
//           selectedAnswer,
//         })
//       );

//       submitForm(
//         { role: "patient", formId, answers: formAnswers },
//         {
//           onSuccess: () => {
//             toast.success("Form submitted successfully!");
//             router.replace("/form-success");
//           },
//           onError: () => toast.error("Failed to submit form"),
//         }
//       );
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const firstError = error.errors[0];
//         toast.error(firstError.message);
//       } else {
//         toast.error("An error occurred. Please try again.");
//         console.error("Form submission error:", error);
//       }
//     }
//   };

//   if (!data) {
//     return <div className="p-6 text-center">Loading consent form...</div>;
//   }

//   return (
//     <div className="flex flex-col gap-10 max-w-6xl mx-auto">
//       <Image
//         src={AspireConsentBlackLogo || "/placeholder.svg"}
//         alt="Aspire Logo"
//         width={140}
//         className="object-contain"
//         priority
//       />
//       <div className="py-10 px-10 bg-[#698AFF4D] rounded-lg shadow-sm border border-gray-200 text-lg">
//         Hi {data.patient.fullName}, You&apos;ve scheduled a
//         <span className="font-semibold"> {data.procedure.name}</span>! Please
//         take a moment to complete this short quiz to help you better understand
//         the procedure and what to expect. If you&apos;re unsure about any
//         answer, feel free to watch the provided video.
//       </div>
//       <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-6">
//             {data.snapshotMCQs.map((mcq) => (
//               <div
//                 key={mcq.id}
//                 className={`p-4 border rounded-md ${
//                   activeQuestion === mcq.id
//                     ? "border-blue-500 ring-1 ring-blue-500"
//                     : answers[mcq.id]
//                     ? answerStatus[mcq.id]
//                       ? "border-green-200 bg-green-50"
//                       : "border-red-200 bg-red-50"
//                     : "border-gray-200 bg-white"
//                 }`}
//                 onClick={() => setActiveQuestion(mcq.id)}
//               >
//                 <p className="font-medium text-gray-700 mb-3">
//                   Q: {mcq.questionText}
//                 </p>
//                 <div className="space-y-2">
//                   {mcq.options.map((option, index) => (
//                     <div
//                       className="flex items-center justify-between"
//                       key={`${mcq.id}-${option}`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-600">
//                           {String.fromCharCode(97 + index).toUpperCase()}.
//                         </span>
//                         <span className="text-gray-600">{option}</span>
//                       </div>
//                       <div
//                         className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${
//                           answers[mcq.id] === option
//                             ? answerStatus[mcq.id]
//                               ? "bg-green-100 border-green-400"
//                               : "bg-red-100 border-red-400"
//                             : "border-gray-300 bg-white"
//                         }`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleAnswerSelect(mcq.id, option);
//                         }}
//                       >
//                         {answers[mcq.id] === option &&
//                           (answerStatus[mcq.id] ? (
//                             <Check className="w-4 h-4 text-green-600" />
//                           ) : (
//                             <X className="w-4 h-4 text-red-600" />
//                           ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex justify-between mt-4">
//                   <div className="text-sm">
//                     {answers[mcq.id] && (
//                       <span
//                         className={
//                           answerStatus[mcq.id]
//                             ? "text-green-600"
//                             : "text-red-600"
//                         }
//                       >
//                         {answerStatus[mcq.id] ? "Correct" : "Incorrect"}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {currentVideo?.mcqId === mcq.id ? (
//                       <button
//                         type="button"
//                         className="text-sm text-blue-500 hover:underline"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setCurrentVideo(null);
//                         }}
//                       >
//                         Hide video
//                       </button>
//                     ) : (
//                       <button
//                         type="button"
//                         className="text-sm text-blue-500 hover:underline flex items-center gap-1"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setCurrentVideo({ mcqId: mcq.id, autoplay: false });
//                         }}
//                       >
//                         <Play className="w-3 h-3" /> Watch video
//                       </button>
//                     )}
//                   </div>
//                 </div>
//                 {currentVideo?.mcqId === mcq.id && (
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">
//                       Video:{" "}
//                       {getPathAfterUploadsImages(
//                         mcq.videoName ||
//                           "/uploads/aspire-consent/placeholder.mp4"
//                       ) || "Explanation"}
//                     </h4>
//                     <iframe
//                       src={`${mcq.videoUrl}${
//                         currentVideo.autoplay ? "?autoplay=1" : ""
//                       }`}
//                       className="w-full aspect-video rounded"
//                       allowFullScreen
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     ></iframe>
//                   </div>
//                 )}
//               </div>
//             ))}
//             <div className="mt-6 flex items-start gap-2">
//               <div
//                 className={`mt-0.5 w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center cursor-pointer ${
//                   consent ? "border-blue-500 bg-blue-50" : "border-gray-300"
//                 }`}
//                 onClick={() => setConsent(!consent)}
//               >
//                 {consent && <Check className="w-4 h-4 text-blue-600" />}
//               </div>
//               <label
//                 className="text-sm text-gray-600 cursor-pointer"
//                 onClick={() => setConsent(!consent)}
//               >
//                 I understand the information provided and consent to the
//                 treatment.
//               </label>
//             </div>
//             <div className="flex justify-end gap-4 mt-6">
//               <button
//                 type="button"
//                 className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//                 onClick={handleSaveDraft}
//                 disabled={isSavingDraft}
//               >
//                 {isSavingDraft ? "Saving..." : "Save Progress"}
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={!allCorrect || !consent || isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import type React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Check, X, Play, ChevronLeft, ChevronRight } from "lucide-react";
// import { z } from "zod";
// import { toast } from "react-hot-toast";
// import type { TConsentForm } from "@/types/consent-form";
// import {
//   useSaveDraftAnswers,
//   useSubmitConsentForm,
// } from "@/services/consent-form/ConsentFomMutation";
// import { useRouter } from "next/navigation";
// import getPathAfterUploadsImages from "@/utils/getSplittedPath";
// import Image from "next/image";
// import { AspireConsentBlackLogo } from "@/asssets";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";

// const submitFormSchema = z.object({
//   answers: z.record(z.string().min(1, "Answer is required")),
//   consent: z.boolean().refine((val) => val, {
//     message: "You must consent to the treatment",
//   }),
// });

// type ConsentFormContentProps = {
//   data: TConsentForm | null;
//   formId: string;
// };

// // Animation variants
// const questionVariants = {
//   enter: (direction: number) => ({
//     x: direction > 0 ? 100 : -100,
//     opacity: 0,
//   }),
//   center: {
//     x: 0,
//     opacity: 1,
//     transition: {
//       x: { type: "spring", stiffness: 300, damping: 30 },
//       opacity: { duration: 0.2 },
//     },
//   },
//   exit: (direction: number) => ({
//     x: direction < 0 ? 100 : -100,
//     opacity: 0,
//     transition: {
//       x: { type: "spring", stiffness: 300, damping: 30 },
//       opacity: { duration: 0.2 },
//     },
//   }),
// };

// export default function ConsentFormContent({
//   data,
//   formId,
// }: ConsentFormContentProps) {
//   const router = useRouter();
//   const [answers, setAnswers] = useState<Record<string, string | null>>({});
//   const [answerStatus, setAnswerStatus] = useState<Record<string, boolean>>({});
//   const [consent, setConsent] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState<{
//     mcqId: string;
//     autoplay: boolean;
//   } | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward

//   // Mutations
//   const { mutate: saveDraft, isPending: isSavingDraft } = useSaveDraftAnswers();
//   const { mutate: submitForm, isPending: isSubmitting } =
//     useSubmitConsentForm();

//   useEffect(() => {
//     if (data?.snapshotMCQs) {
//       const initialAnswers = data.snapshotMCQs.reduce((acc, mcq) => {
//         const existingAnswer = data.answers?.find(
//           (a) => a.mcqSnapshotId === mcq.id
//         );
//         acc[mcq.id] = existingAnswer?.selectedAnswer || null;
//         return acc;
//       }, {} as Record<string, string | null>);
//       setAnswers(initialAnswers);

//       const initialStatus = data.snapshotMCQs.reduce((acc, mcq) => {
//         const existingAnswer = data.answers?.find(
//           (a) => a.mcqSnapshotId === mcq.id
//         );
//         acc[mcq.id] = existingAnswer
//           ? existingAnswer.selectedAnswer === mcq.correctAnswer
//           : false;
//         return acc;
//       }, {} as Record<string, boolean>);
//       setAnswerStatus(initialStatus);

//       const hasAnswers = data.answers && data.answers.length > 0;
//       const allCorrect = Object.values(initialStatus).every(Boolean);
//       setConsent(hasAnswers && allCorrect);
//     }
//   }, [data]);

//   const allCorrect = Object.values(answerStatus).every(Boolean);
//   const currentMcq = data?.snapshotMCQs?.[currentQuestionIndex];
//   const isLastQuestion =
//     currentQuestionIndex === (data?.snapshotMCQs?.length ?? 0) - 1;
//   const isFirstQuestion = currentQuestionIndex === 0;

//   const handleAnswerSelect = (mcqId: string, answer: string) => {
//     const mcq = data?.snapshotMCQs.find((q) => q.id === mcqId);
//     if (!mcq) return;
//     const isCorrect = answer === mcq.correctAnswer;
//     setAnswers((prev) => ({ ...prev, [mcqId]: answer }));
//     setAnswerStatus((prev) => ({ ...prev, [mcqId]: isCorrect }));
//   };

//   const handleSaveDraft = () => {
//     const draftAnswers = Object.entries(answers)
//       .filter(([, answer]) => answer !== null)
//       .map(([mcqId, selectedAnswer]) => ({
//         mcqId,
//         selectedAnswer: selectedAnswer as string,
//       }));

//     saveDraft(
//       { role: "patient", formId, answers: draftAnswers },
//       {
//         onSuccess: () => {
//           toast.success("Draft saved successfully");
//           router.replace("/form-save");
//         },
//         onError: () => toast.error("Failed to save draft"),
//       }
//     );
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = submitFormSchema.parse({
//         answers: Object.fromEntries(
//           Object.entries(answers).map(([key, value]) => [key, value || ""])
//         ),
//         consent,
//       });

//       if (!allCorrect) {
//         toast.error("Please correct all wrong answers before submitting");
//         return;
//       }

//       const formAnswers = Object.entries(formData.answers).map(
//         ([mcqId, selectedAnswer]) => ({
//           mcqId,
//           selectedAnswer,
//         })
//       );

//       submitForm(
//         { role: "patient", formId, answers: formAnswers },
//         {
//           onSuccess: () => {
//             toast.success("Form submitted successfully!");
//             router.replace("/form-success");
//           },
//           onError: () => toast.error("Failed to submit form"),
//         }
//       );
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const firstError = error.errors[0];
//         toast.error(firstError.message);
//       } else {
//         toast.error("An error occurred. Please try again.");
//         console.error("Form submission error:", error);
//       }
//     }
//   };

//   const goToNextQuestion = () => {
//     if (!data?.snapshotMCQs) return;
//     const nextIndex = currentQuestionIndex + 1;
//     if (nextIndex < data.snapshotMCQs.length) {
//       setDirection(1);
//       setCurrentQuestionIndex(nextIndex);
//     }
//   };

//   const goToPrevQuestion = () => {
//     if (!data?.snapshotMCQs) return;
//     const prevIndex = currentQuestionIndex - 1;
//     if (prevIndex >= 0) {
//       setDirection(-1);
//       setCurrentQuestionIndex(prevIndex);
//     }
//   };

//   if (!data || !currentMcq) {
//     return <div className="p-6 text-center">Loading consent form...</div>;
//   }

//   return (
//     <div className="flex flex-col gap-10 max-w-6xl mx-auto">
//       <Image
//         src={AspireConsentBlackLogo || "/placeholder.svg"}
//         alt="Aspire Logo"
//         width={140}
//         height={50}
//         className="object-contain"
//         priority
//       />
//       {/* <div className="py-10 px-10 bg-[#698AFF4D] rounded-lg shadow-sm border border-gray-200 text-lg">
//         Hi {data.patient.fullName}, You&apos;ve scheduled a
//         <span className="font-semibold"> {data.procedure.name}</span>! Please
//         take a moment to complete this short quiz to help you better understand
//         the procedure and what to expect. If you&apos;re unsure about any
//         answer, feel free to watch the provided video.
//       </div> */}
//       {/* rounded-lg shadow-sm border border-gray-200 */}
//       <div className="p-4 bg-white ">
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-8">
//             {/* Progress indicator */}
//             <div className="flex justify-between items-center mb-6">
//               <span className="text-sm font-medium text-gray-600">
//                 Question {currentQuestionIndex + 1} of{" "}
//                 {data.snapshotMCQs.length}
//               </span>
//               <div className="flex gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={handleSaveDraft}
//                   disabled={isSavingDraft}
//                 >
//                   {isSavingDraft ? "Saving..." : "Save Draft"}
//                 </Button>
//               </div>
//             </div>

//             {/* Animated question container */}
//             <div className="relative min-h-[400px] overflow-hidden">
//               <AnimatePresence mode="wait" custom={direction}>
//                 <motion.div
//                   key={currentQuestionIndex}
//                   custom={direction}
//                   variants={questionVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   className="absolute inset-0 p-6"
//                 >
//                   <h3 className="text-xl font-medium mb-6">
//                     {currentMcq.questionText}
//                   </h3>

//                   <RadioGroup
//                     value={answers[currentMcq.id] || ""}
//                     onValueChange={(value) =>
//                       handleAnswerSelect(currentMcq.id, value)
//                     }
//                     className="space-y-3 w-fit"
//                   >
//                     {currentMcq.options.map((option, index) => {
//                       const letter = String.fromCharCode(65 + index);
//                       const isSelected = answers[currentMcq.id] === option;
//                       const isCorrect =
//                         isSelected && answerStatus[currentMcq.id];
//                       const isIncorrect =
//                         isSelected && !answerStatus[currentMcq.id];

//                       return (
//                         <label // make entire area clickable
//                           htmlFor={`${currentMcq.id}-${option}`}
//                           className="block"
//                           key={`${currentMcq.id}-${option}`}
//                         >
//                           <motion.div
//                             key={`${currentMcq.id}-${option}`}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.05 }}
//                             className={`flex items-center gap-3 p-3 rounded-lg border transition-colors px-10 cursor-pointer ${
//                               isSelected
//                                 ? isCorrect
//                                   ? "border-green-500 bg-green-50"
//                                   : isIncorrect
//                                   ? "border-red-500 bg-red-50"
//                                   : "border-gray-300"
//                                 : "border-gray-300 hover:bg-gray-50"
//                             }`}
//                           >
//                             <RadioGroupItem
//                               value={option}
//                               id={`${currentMcq.id}-${option}`}
//                               className="sr-only"
//                             />
//                             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-medium">
//                               {letter}
//                             </div>
//                             <div className="flex-1 py-1">{option}</div>
//                             {isSelected && (
//                               <div className="flex-shrink-0">
//                                 {isCorrect ? (
//                                   <Check className="h-5 w-5 text-green-600" />
//                                 ) : (
//                                   <X className="h-5 w-5 text-red-600" />
//                                 )}
//                               </div>
//                             )}
//                           </motion.div>
//                         </label>
//                       );
//                     })}
//                   </RadioGroup>

//                   {answers[currentMcq.id] && !answerStatus[currentMcq.id] && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="mt-4 text-red-600 text-sm"
//                     >
//                       Incorrect answer. Please try again or watch the video for
//                       help.
//                     </motion.div>
//                   )}

//                   {currentVideo?.mcqId === currentMcq.id && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
//                     >
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">
//                         Video:{" "}
//                         {getPathAfterUploadsImages(
//                           currentMcq.videoName ||
//                             "/uploads/aspire-consent/placeholder.mp4"
//                         ) || "Explanation"}
//                       </h4>
//                       <iframe
//                         src={`${currentMcq.videoUrl}${
//                           currentVideo.autoplay ? "?autoplay=1" : ""
//                         }`}
//                         className="w-full aspect-video rounded"
//                         allowFullScreen
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       ></iframe>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               </AnimatePresence>
//             </div>

//             <div
//               className={`mt-6 flex  ${
//                 isLastQuestion ? "flex-col" : "flex-row  justify-between"
//               }`}
//             >
//               <div className="mt-6 flex justify-start">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2"
//                   onClick={() => {
//                     if (currentVideo?.mcqId === currentMcq.id) {
//                       setCurrentVideo(null);
//                     } else {
//                       setCurrentVideo({
//                         mcqId: currentMcq.id,
//                         autoplay: false,
//                       });
//                     }
//                   }}
//                 >
//                   <Play className="w-4 h-4" />
//                   {currentVideo?.mcqId === currentMcq.id
//                     ? "Hide video"
//                     : "Watch video"}
//                 </Button>
//               </div>
//               {/* Navigation buttons */}
//               <div className="flex justify-end gap-7 mt-8">
//                 {!isLastQuestion ? (
//                   <>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={goToPrevQuestion}
//                       disabled={isFirstQuestion}
//                       className="flex items-center gap-2"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Previous
//                     </Button>

//                     <Button
//                       type="button"
//                       onClick={goToNextQuestion}
//                       // disabled={!answers[currentMcq.id]}
//                       className="flex items-center gap-2"
//                     >
//                       Next
//                       <ChevronRight className="w-4 h-4" />
//                     </Button>
//                   </>
//                 ) : (
//                   <div className="space-y-4 w-full">
//                     {/* Consent checkbox - only shown on last question */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.2 }}
//                       className="p-4 border border-gray-200 rounded-lg bg-gray-50"
//                     >
//                       <div className="flex items-start gap-3">
//                         <div
//                           className={`mt-0.5 w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center cursor-pointer ${
//                             consent
//                               ? "border-blue-500 bg-blue-50"
//                               : "border-gray-300"
//                           }`}
//                           onClick={() => setConsent(!consent)}
//                         >
//                           {consent && (
//                             <Check className="w-4 h-4 text-blue-600" />
//                           )}
//                         </div>
//                         <label
//                           className="text-sm text-gray-700 cursor-pointer"
//                           onClick={() => setConsent(!consent)}
//                         >
//                           I understand the information provided and consent to
//                           the treatment.
//                         </label>
//                       </div>
//                     </motion.div>

//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.4 }}
//                       className="flex justify-end gap-4"
//                     >
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={goToPrevQuestion}
//                         disabled={isFirstQuestion}
//                         className="flex items-center gap-2"
//                       >
//                         <ChevronLeft className="w-4 h-4" />
//                         Previous
//                       </Button>

//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={handleSaveDraft}
//                         disabled={isSavingDraft}
//                       >
//                         {isSavingDraft ? "Saving..." : "Save Draft"}
//                       </Button>
//                       <Button
//                         type="submit"
//                         disabled={!allCorrect || !consent || isSubmitting}
//                       >
//                         {isSubmitting ? "Submitting..." : "Submit"}
//                       </Button>
//                     </motion.div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
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
import Image from "next/image";
import { AspireConsentBlackLogo } from "@/asssets";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

type ConsentFormContentProps = {
  data: TConsentForm | null;
  formId: string;
};

// Animation variants
const questionVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

const optionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.3 },
  }),
  hover: { scale: 1.02, backgroundColor: "rgba(243, 244, 246, 1)" },
  tap: { scale: 0.98 },
  selected: { scale: 1.02, backgroundColor: "rgba(243, 244, 246, 1)" },
};

export default function ConsentFormContent({
  data,
  formId,
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
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const [showSummary, setShowSummary] = useState(false);

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
    if (nextIndex < data.snapshotMCQs.length) {
      setDirection(1);
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
      setDirection(-1);
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
    return <div className="p-6 text-center">Loading consent form...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Image
          src={AspireConsentBlackLogo || "/placeholder.svg"}
          alt="Aspire Logo"
          width={140}
          height={50}
          className="object-contain"
          priority
        />
        <div className="text-sm text-gray-500">
          Patient:{" "}
          <span className="font-medium text-gray-700">
            {data.patient.fullName}
          </span>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">
            Consent Form: {data.procedure.name}
          </h1>
          <p className="opacity-90">
            Please complete this short quiz to understand your procedure better.
            Watch the videos if you need help.
          </p>
        </div>

        <div className="relative h-1.5 bg-gray-100">
          <motion.div
            className="absolute top-0 left-0 h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Progress indicator */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    {showSummary
                      ? "Review"
                      : `Question ${currentQuestionIndex + 1} of ${
                          data.snapshotMCQs.length
                        }`}
                  </span>

                  {!showSummary && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                          >
                            <Info className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Answer all questions correctly to proceed. You can
                            watch the video for help.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft}
                    className="text-xs"
                  >
                    {isSavingDraft ? "Saving..." : "Save Progress"}
                  </Button>
                </div>
              </div>

              {/* Question navigation dots */}
              <div className="flex justify-center gap-1.5 mb-8">
                {data.snapshotMCQs.map((mcq, index) => (
                  <button
                    key={mcq.id}
                    type="button"
                    onClick={() => {
                      setDirection(index > currentQuestionIndex ? 1 : -1);
                      setCurrentQuestionIndex(index);
                      setShowSummary(false);
                    }}
                    className={`relative h-2.5 w-2.5 rounded-full transition-all ${
                      index === currentQuestionIndex && !showSummary
                        ? "bg-blue-600 scale-125"
                        : answers[mcq.id]
                        ? answerStatus[mcq.id]
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to question ${index + 1}`}
                  >
                    {answers[mcq.id] && (
                      <span
                        className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
                          answerStatus[mcq.id] ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowSummary(true)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    showSummary ? "bg-blue-600 scale-125" : "bg-gray-300"
                  }`}
                  aria-label="Review answers"
                />
              </div>

              {/* Animated question container */}
              <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait" custom={direction}>
                  {showSummary ? (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-800">
                        Review Your Answers
                      </h2>
                      <div className="space-y-4">
                        {data.snapshotMCQs.map((mcq, index) => (
                          <div
                            key={mcq.id}
                            className={`p-4 rounded-lg border ${
                              !answers[mcq.id]
                                ? "border-gray-200 bg-gray-50"
                                : answerStatus[mcq.id]
                                ? "border-green-100 bg-green-50"
                                : "border-red-100 bg-red-50"
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
                                  setDirection(-1);
                                  setCurrentQuestionIndex(index);
                                  setShowSummary(false);
                                }}
                                className="text-xs"
                              >
                                Edit
                              </Button>
                            </div>
                            {answers[mcq.id] && (
                              <div className="mt-2 pl-4 border-l-2 border-gray-200">
                                <span className="text-sm text-gray-500">
                                  Your answer:{" "}
                                </span>
                                <span className="text-sm font-medium">
                                  {answers[mcq.id]}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Consent checkbox */}
                      <div className="p-5 border border-gray-200 rounded-lg bg-blue-50 mt-8">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center cursor-pointer ${
                              consent
                                ? "border-blue-500 bg-blue-100"
                                : "border-gray-300 bg-white"
                            }`}
                            onClick={() => setConsent(!consent)}
                          >
                            {consent && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <label
                            className="text-sm text-gray-700 cursor-pointer"
                            onClick={() => setConsent(!consent)}
                          >
                            I understand the information provided about{" "}
                            <span className="font-medium">
                              {data.procedure.name}
                            </span>{" "}
                            and consent to the treatment.
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentQuestionIndex}
                      custom={direction}
                      variants={questionVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-6">
                        {currentMcq.questionText}
                      </h3>

                      <RadioGroup
                        value={answers[currentMcq.id] || ""}
                        onValueChange={(value) =>
                          handleAnswerSelect(currentMcq.id, value)
                        }
                        className="space-y-4"
                      >
                        {currentMcq.options.map((option, index) => {
                          const letter = String.fromCharCode(65 + index);
                          const isSelected = answers[currentMcq.id] === option;
                          const isCorrect =
                            isSelected && answerStatus[currentMcq.id];
                          const isIncorrect =
                            isSelected && !answerStatus[currentMcq.id];

                          return (
                            <motion.div
                              key={`${currentMcq.id}-${option}`}
                              custom={index}
                              variants={optionVariants}
                              initial="initial"
                              animate="animate"
                              whileHover={!isSelected ? "hover" : undefined}
                              whileTap="tap"
                              className={`relative overflow-hidden rounded-lg border transition-all ${
                                isSelected
                                  ? isCorrect
                                    ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                                    : isIncorrect
                                    ? "border-red-500 bg-red-50 ring-1 ring-red-500"
                                    : "border-gray-300"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 0.05 }}
                                  className={`absolute inset-0 ${
                                    isCorrect
                                      ? "bg-green-500"
                                      : isIncorrect
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                                  }`}
                                />
                              )}
                              <label
                                htmlFor={`${currentMcq.id}-${option}`}
                                className="flex items-center gap-4 p-4 cursor-pointer relative z-10"
                              >
                                <div
                                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-medium ${
                                    isSelected
                                      ? isCorrect
                                        ? "bg-green-500"
                                        : isIncorrect
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                      : "bg-gray-200 text-gray-700"
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
                                    {isCorrect ? (
                                      <Check className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <X className="h-5 w-5 text-red-600" />
                                    )}
                                  </div>
                                )}
                              </label>
                            </motion.div>
                          );
                        })}
                      </RadioGroup>

                      {answers[currentMcq.id] &&
                        !answerStatus[currentMcq.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm flex items-start gap-2"
                          >
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Incorrect answer</p>
                              <p className="text-red-600 mt-1">
                                Please try again or watch the video for more
                                information.
                              </p>
                            </div>
                          </motion.div>
                        )}

                      {answers[currentMcq.id] &&
                        answerStatus[currentMcq.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-green-700 text-sm flex items-start gap-2"
                          >
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Correct!</p>
                              <p className="text-green-600 mt-1">
                                You can proceed to the next question.
                              </p>
                            </div>
                          </motion.div>
                        )}

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
            </div>

            <Separator />

            {/* Footer with navigation */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  {!showSummary && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (currentVideo?.mcqId === currentMcq.id) {
                          setCurrentVideo(null);
                        } else {
                          setCurrentVideo({
                            mcqId: currentMcq.id,
                            autoplay: false,
                          });
                        }
                      }}
                    >
                      <Play className="w-4 h-4" />
                      {currentVideo?.mcqId === currentMcq.id
                        ? "Hide video"
                        : "Watch video"}
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevQuestion}
                    disabled={isFirstQuestion && !showSummary}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {showSummary ? "Back to Questions" : "Previous"}
                  </Button>

                  {showSummary ? (
                    <Button
                      type="submit"
                      disabled={!allCorrect || !consent || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Form"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={goToNextQuestion}
                      disabled={!answers[currentMcq.id]}
                      className="flex items-center gap-2"
                    >
                      {isLastQuestion ? "Review Answers" : "Next"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
