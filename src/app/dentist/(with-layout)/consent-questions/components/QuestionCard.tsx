"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";

// Define the schema for a question option
const optionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  text: z.string().min(1, "Option text is required"),
});

// Define the schema for the entire form
const questionFormSchema = z.object({
  questionText: z
    .string()
    .min(5, "Question text must be at least 5 characters"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  video: z.any().optional(),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionCardProps {
  index: number;
  questionData: QuestionFormValues;
  onUpdate: (data: QuestionFormValues) => void;
  onRemove: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function QuestionCard({
  index,
  questionData,
  onUpdate,
  onRemove,
  isFirst = false,
}: QuestionCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with provided data or defaults
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: questionData || {
      questionText: "",
      options: [
        { label: "A", text: "" },
        { label: "B", text: "" },
      ],
      correctAnswer: "",
      video: undefined,
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const options = watch("options");

  // Update form when questionData changes
  useEffect(() => {
    if (questionData) {
      setValue("questionText", questionData.questionText);
      setValue("options", questionData.options);
      setValue("correctAnswer", questionData.correctAnswer);
      if (questionData.video) {
        setValue("video", questionData.video);
      }
    }
  }, [questionData, setValue]);

  // Handle adding a new option
  const addOption = () => {
    const currentOptions = form.getValues("options");
    const nextLabel = String.fromCharCode(65 + currentOptions.length); // A, B, C, D, etc.
    setValue("options", [...currentOptions, { label: nextLabel, text: "" }]);
  };

  // Handle removing an option
  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options");
    if (currentOptions.length <= 2) return; // Maintain at least 2 options

    // Remove the option
    const newOptions = currentOptions.filter((_, i) => i !== index);

    // Relabel the options (A, B, C, etc.)
    const relabeledOptions = newOptions.map((option, i) => ({
      ...option,
      label: String.fromCharCode(65 + i),
    }));

    setValue("options", relabeledOptions);
  };

  const onSubmit = (data: QuestionFormValues) => {
    setIsSubmitting(true);
    try {
      onUpdate(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      // Only destructure what you need
      if (type === "change") {
        const formData = form.getValues();
        const result = questionFormSchema.safeParse(formData);
        if (result.success) {
          onUpdate(formData);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-lg">Question {index + 1}:</h2>
            {!isFirst && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </div>

          {/* Question Text */}
          <FormField
            control={control}
            name="questionText"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Question Text:</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your question here..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel className="font-medium">Options:</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Option
              </Button>
            </div>

            {options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-10 text-center">
                  <span className="text-md text-gray-500">{option.label}.</span>
                </div>
                <FormField
                  control={control}
                  name={`options.${idx}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Option ${option.label}`}
                          {...field}
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
                  onClick={() => removeOption(idx)}
                  disabled={options.length <= 2}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          <FormField
            control={control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Correct Answer:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.label}
                          id={`answer-${index}-${option.label}`}
                        />
                        <FormLabel
                          htmlFor={`answer-${index}-${option.label}`}
                          className="font-normal"
                        >
                          {option.label}
                        </FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Video Upload */}
          <FormField
            control={control}
            name="video"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
                <FormLabel className="font-medium">Question Video:</FormLabel>
                <FormControl>
                  <FileUploader
                    onFileUpload={(files) => {
                      field.onChange(files ? files[0] : null);
                    }}
                    showPreview={true}
                    icon="ri-upload-cloud-2-line"
                    maxFiles={1}
                    text="Upload video"
                    extraText="Drag and drop a video or click to browse"
                    disabled={isSubmitting}
                    error={form.formState.errors.video?.message as string}
                    allowedTypes={[
                      "video/mp4",
                      "video/webm",
                      "video/ogg",
                      "video/quicktime",
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
