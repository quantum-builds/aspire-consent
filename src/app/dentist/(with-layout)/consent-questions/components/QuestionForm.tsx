"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import getPathAfterUploadsImages from "@/utils/getSplittedPath";
import { ExtendedTMCQ, TMCQForm } from "@/types/mcq";

// Define the schema for a question option
const optionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  text: z.string().min(1, "Option text is required"),
});

// Define the schema for a single question
const questionSchema = z.object({
  id: z.string().optional(),
  procedureId: z.string(),
  questionText: z
    .string()
    .min(5, "Question text must be at least 5 characters"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  videoUrl: z
    .instanceof(File)
    .refine(
      (file) => !file || (file && file.type.startsWith("video/")),
      "Only video files are allowed"
    ),
});

// Define the schema for all questions
const questionsFormSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

type QuestionsFormValues = z.infer<typeof questionsFormSchema>;

interface QuestionFormProps {
  data?: ExtendedTMCQ[];
  onSubmit: (data: TMCQForm[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isPending?: boolean;
  onCancel?: () => void;
  procedureId: string;
  procedureName: string | null;
}

export default function QuestionForm({
  data,
  onSubmit,
  onDelete,
  isPending = false,
  onCancel,
  procedureId,
  procedureName,
}: QuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const initialQuestions =
    data && data.length > 0
      ? data.map((q) => {
          const options = q.options.map((opt, i) => ({
            label: String.fromCharCode(65 + i),
            text: opt,
          }));

          const correctOption = options.find(
            (opt) => opt.text === q.correctAnswer
          );
          const correctAnswerLabel = correctOption?.label || "";

          return {
            id: q.id || undefined,
            procedureId: q.procedureId,
            questionText: q.questionText,
            options,
            correctAnswer: correctAnswerLabel,
            videoUrl: undefined,
          };
        })
      : [
          {
            questionText: "",
            procedureId: procedureId || "",
            options: [
              { label: "A", text: "" },
              { label: "B", text: "" },
            ],
            correctAnswer: "",
            videoUrl: undefined,
          },
        ];

  // Ensure we always have at least one question
  if (initialQuestions.length === 0) {
    initialQuestions.push({
      id: undefined,
      questionText: "",
      procedureId: procedureId || "",
      options: [
        { label: "A", text: "" },
        { label: "B", text: "" },
      ],
      correctAnswer: "",
      videoUrl: undefined,
    });
  }

  const form = useForm<QuestionsFormValues>({
    resolver: zodResolver(questionsFormSchema),
    defaultValues: {
      questions: initialQuestions,
    },
  });

  // Fetch videos for existing questions
  useEffect(() => {
    if (data) {
      data.forEach((q, index) => {
        if (q.videoUrl && q.videoName) {
          const fetchVideo = async () => {
            try {
              // console.log("video url is ", q.videoUrl);
              const response = await fetch(q.videoUrl || "");
              if (!response.ok) {
                throw new Error(`Failed to fetch video: ${response.status}`);
              }

              const blob = await response.blob();
              const file = new File(
                [blob],
                getPathAfterUploadsImages(q.videoName || ""),
                {
                  type: blob.type,
                }
              );

              form.setValue(`questions.${index}.videoUrl`, file);
            } catch (error) {
              console.error("Error fetching video:", error);
              toast.error(`Failed to load video for question ${index + 1}`);
            }
          };

          fetchVideo();
        }
      });
    }
  }, [data, form]);

  // Add a new question
  const handleAddQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    form.setValue("questions", [
      ...currentQuestions,
      {
        questionText: "",
        procedureId: procedureId || "", // Use provided procedureId or empty string
        options: [
          { label: "A", text: "" },
          { label: "B", text: "" },
        ],
        correctAnswer: "",
        videoUrl: null as unknown as File,
      },
    ]);
  };
  const handleRemoveQuestion = async (index: number) => {
    const currentQuestions = form.getValues("questions") || [];

    // Don't allow removing if it's the last question and there's no data
    if (currentQuestions.length === 1 && (!data || data.length === 0)) {
      toast.error("At least one question is required");
      return;
    }

    const questionToRemove = currentQuestions[index];

    try {
      setIsSubmitting(true);

      if (questionToRemove.id) {
        await onDelete(questionToRemove.id);
      }

      // Then remove the question
      const updatedQuestions = currentQuestions.filter((_, i) => i !== index);

      // Update form with the new questions array
      form.setValue("questions", updatedQuestions);

      // If we're deleting the last question and there was existing data,
      // add a new empty question
      if (updatedQuestions.length === 0 && data && data.length > 0) {
        form.setValue("questions", [
          {
            questionText: "",
            procedureId: procedureId || "",
            options: [
              { label: "A", text: "" },
              { label: "B", text: "" },
            ],
            correctAnswer: "",
            videoUrl: null as unknown as File,
          },
        ]);
      } else {
        form.setValue("questions", updatedQuestions);
      }
    } catch (error) {
      console.error("Error removing question:", error);
      toast.error("Failed to remove question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOption = (questionIndex: number) => {
    const currentOptions =
      form.getValues(`questions.${questionIndex}.options`) || [];
    const nextLabel = String.fromCharCode(65 + currentOptions.length); // A, B, C, D, etc.

    form.setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      { label: nextLabel, text: "" },
    ]);
  };

  // Remove option from a question
  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions =
      form.getValues(`questions.${questionIndex}.options`) || [];
    if (currentOptions.length <= 2) return; // Maintain at least 2 options

    const newOptions = currentOptions.filter((_, i) => i !== optionIndex);

    // Relabel the options (A, B, C, etc.)
    const relabeledOptions = newOptions.map((option, i) => ({
      ...option,
      label: String.fromCharCode(65 + i),
    }));

    // Set the new options and manually mark the field as dirty
    form.setValue(`questions.${questionIndex}.options`, relabeledOptions);
    form.setValue(`questions.${questionIndex}.options`, relabeledOptions, {
      shouldDirty: true,
    });
  };
  const formWatch = form.watch();
  useEffect(() => {
    const formValues = form.getValues();
    const questions = formValues.questions || [];

    if (questions.length === 0) {
      setFormProgress(0);
      return;
    }

    let completedFields = 0;
    let totalFields = 0;

    questions.forEach((question) => {
      // Count question text
      if (question.questionText) completedFields++;
      totalFields++;

      // Check if options exist before trying to iterate over them
      if (question.options && Array.isArray(question.options)) {
        // Count options
        question.options.forEach((option) => {
          if (option.text) completedFields++;
          totalFields++;
        });
      }

      // Count correct answer
      if (question.correctAnswer) completedFields++;
      totalFields++;

      // Count video
      if (question.videoUrl) completedFields++;
      totalFields++;
    });

    setFormProgress(Math.min(completedFields / totalFields, 1));
  }, [formWatch, form]);

  const handleSubmit = async (formData: QuestionsFormValues) => {
    if (formData.questions.length === 0) {
      toast.error("No Question To Save");
      return;
    }

    const validQuestions = formData.questions.filter(
      (q) => q.questionText.trim() !== ""
    );

    if (validQuestions.length === 0) {
      toast.error("Please add at least one valid question");
      return;
    }

    try {
      setIsSubmitting(true);

      // Get dirty fields information from the form
      const dirtyFields = form.formState.dirtyFields.questions || [];

      // Transform the form data to match TMCQForm[]
      const transformedData = validQuestions.map((question, index) => {
        // Find the correct option by matching the label
        const correctOption = question.options.find(
          (opt) => opt.label === question.correctAnswer
        );

        if (!correctOption) {
          throw new Error(
            `No matching option found for correct answer label: ${question.correctAnswer}`
          );
        }

        // Check if options were modified (either content changed or length changed)
        const originalOptions = initialQuestions[index]?.options || [];
        const optionsChanged =
          question.options.length !== originalOptions.length ||
          question.options.some(
            (opt, i) =>
              opt.text !== originalOptions[i]?.text ||
              opt.label !== originalOptions[i]?.label
          );

        return {
          id: question.id,
          questionText: question.questionText,
          correctAnswer: correctOption.text,
          options: question.options.map((opt) => opt.text),
          videoUrl: question.videoUrl,
          procedureId: question.procedureId || (procedureId as string),
          isNew: !question.id,
          dirtyFields: {
            ...dirtyFields[index],
            // Force options to be marked as dirty if they changed
            options: optionsChanged ? true : dirtyFields[index]?.options,
          },
        };
      });

      await onSubmit(transformedData);
    } catch (error) {
      console.error("Error submitting questions:", error);
      toast.error("Failed to save questions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" space-y-6">
      {/* Form Progress Bar */}
      <div className="bg-gray-100 h-2 rounded-full w-full mb-6">
        <div
          className="bg-[#698AFF] h-2 rounded-full duration-500 ease-in-out transition-all"
          style={{ width: `${formProgress * 100}%` }}
        />
      </div>

      {/* Loading Overlay */}
      {(isSubmitting || isPending) && (
        <div className="flex bg-background/80 justify-center backdrop-blur-sm fixed inset-0 items-center z-50">
          <div className="flex flex-col gap-4 items-center">
            <Loader2 className="h-10 text-[#698AFF] w-10 animate-spin" />
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 ">
          <Card className="mb-6 border-none shadow-none w-11/12 mx-auto">
            <CardHeader className="px-0">
              <CardTitle className="text-xl font-semibold">
                Questions for {procedureName}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-4 space-y-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {form.watch("questions")?.map((question, questionIndex) => (
                  <div
                    key={question.id || `new-${questionIndex}`}
                    className="rounded-lg border p-6 shadow-sm "
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-medium text-lg">
                        Question {questionIndex + 1}
                      </h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>

                    {/* Question Text */}
                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.questionText`}
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="font-medium">Text:</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your question here..."
                              className="resize-none"
                              {...field}
                              disabled={isSubmitting}
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
                          onClick={() => handleAddOption(questionIndex)}
                          className="flex items-center gap-1"
                          disabled={isSubmitting}
                        >
                          <Plus className="h-4 w-4" /> Add Option
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.correctAnswer`}
                        render={({ field }) => (
                          <FormItem>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="space-y-2"
                            >
                              {form
                                .watch(`questions.${questionIndex}.options`)
                                ?.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <RadioGroupItem
                                      value={option.label}
                                      id={`answer-${questionIndex}-${option.label}`}
                                      disabled={isSubmitting}
                                    />
                                    <div className="w-10">
                                      <span className="text-md text-gray-500">
                                        {option.label}.
                                      </span>
                                    </div>
                                    <FormField
                                      control={form.control}
                                      name={`questions.${questionIndex}.options.${optionIndex}.text`}
                                      render={({ field: optionField }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              placeholder={`Option ${option.label}`}
                                              {...optionField}
                                              disabled={isSubmitting}
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
                                          questionIndex,
                                          optionIndex
                                        )
                                      }
                                      disabled={
                                        form.watch(
                                          `questions.${questionIndex}.options`
                                        )?.length <= 2 || isSubmitting
                                      }
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                            </RadioGroup>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Video Upload */}
                    <Controller
                      control={form.control}
                      name={`questions.${questionIndex}.videoUrl`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-medium">Video:</FormLabel>
                          <FormControl>
                            <FileUploader
                              onFileUpload={(files) => {
                                field.onChange(files ? files[0] : null);
                              }}
                              alwaysShowDropzone={false}
                              showPreview={true}
                              icon="ri-upload-cloud-2-line"
                              maxFiles={1}
                              text="Upload video"
                              extraText="Drag and drop a video or click to browse"
                              disabled={isSubmitting}
                              error={
                                form.formState.errors.questions?.[questionIndex]
                                  ?.videoUrl?.message as string
                              }
                              allowedTypes={[
                                "video/mp4",
                                "video/webm",
                                "video/ogg",
                                "video/quicktime",
                              ]}
                              defaultPreview={data?.[questionIndex]?.videoUrl}
                              defaultName={data?.[questionIndex]?.videoName}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                {onCancel && (
                  // <Button
                  //   type="button"
                  //   variant="outline"
                  //   onClick={onCancel}
                  //   className="px-5 py-2"
                  //   disabled={isSubmitting}
                  // >
                  //   Cancel
                  // </Button>
                  <div className="flex-1"></div>
                )}
                <div className="space-x-2 flex items-center ">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddQuestion}
                    className="px-5 py-2"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Another Question
                  </Button>
                  <Button
                    type="submit"
                    className="px-5 py-2 bg-[#698AFF] hover:bg-[#5470E0] text-white"
                    disabled={isSubmitting || isPending}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {data ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      "Save All Questions"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
