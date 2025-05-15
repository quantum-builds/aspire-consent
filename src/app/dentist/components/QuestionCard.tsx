"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
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
import toast from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { get } from "lodash"; // Import get from lodash for safe property access

export type MCQItem = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  videoUrl?: string;
  videoFile?: File | string;
};

interface MCQEditorProps {
  basePath: string; // Base path for the form fields (e.g., "mcqs")
  isSubmitting: boolean;
  showVideoUpload?: boolean;
  defaultVideoUrls?: { [key: string]: string | undefined };
  defaultVideoNames?: { [key: string]: string | undefined };
}

export default function MCQEditor({
  basePath,
  isSubmitting,
  showVideoUpload = true,
  defaultVideoUrls = {},
  defaultVideoNames = {},
}: MCQEditorProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mcqs: MCQItem[] = watch(basePath) || [];

  const handleRemoveQuestion = (questionIndex: number) => {
    const currentMCQs = [...mcqs];

    if (currentMCQs.length === 1) {
      toast.error("At least one question is required");
      return;
    }

    currentMCQs.splice(questionIndex, 1);
    setValue(basePath, currentMCQs, { shouldDirty: true });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const currentMCQs = [...mcqs];
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
    setValue(basePath, currentMCQs, { shouldDirty: true });
  };

  const handleAddOption = (questionIndex: number) => {
    const currentMCQs = [...mcqs];
    const currentOptions = [...currentMCQs[questionIndex].options];
    currentOptions.push("");
    currentMCQs[questionIndex].options = currentOptions;
    setValue(basePath, currentMCQs);
  };

  const handleAddQuestion = () => {
    const currentMCQs = [...mcqs];
    currentMCQs.push({
      id: `new-question-${Date.now()}`,
      questionText: "",
      options: ["", ""],
      correctAnswer: "",
      videoUrl: "",
    });
    setValue(basePath, currentMCQs, {
      shouldDirty: true,
    });
  };

  // Helper function to safely access nested error messages
  const getNestedErrorMessage = (path: string): string | undefined => {
    return get(errors, path)?.message as string | undefined;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mcqs.map((mcq, mcqIndex: number) => {
          const fieldPath = `${basePath}.${mcqIndex}`;
          return (
            <div
              key={mcq.id || mcqIndex}
              className="p-6 border rounded-lg shadow-sm bg-white relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveQuestion(mcqIndex)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>

              <FormField
                name={`${fieldPath}.questionText`}
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-medium">Question:</FormLabel>
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

              <div className="space-y-4 mb-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="font-medium">Options:</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(mcqIndex)}
                    className="flex items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4" /> Add Option
                  </Button>
                </div>

                <FormField
                  name={`${fieldPath}.correctAnswer`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-2"
                      >
                        {watch(`${fieldPath}.options`)?.map(
                          (option: string, optionIndex: number) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-2"
                            >
                              <RadioGroupItem
                                value={option}
                                id={`answer-${mcqIndex}-${optionIndex}`}
                                disabled={isSubmitting}
                              />
                              <div className="w-6">
                                <span className="text-md text-gray-500">
                                  {String.fromCharCode(
                                    97 + optionIndex
                                  ).toUpperCase()}
                                  .
                                </span>
                              </div>
                              <FormField
                                name={`${fieldPath}.options.${optionIndex}`}
                                render={({ field: optionField }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder={`Option ${String.fromCharCode(
                                          97 + optionIndex
                                        ).toUpperCase()}`}
                                        {...optionField}
                                        className="border rounded px-3 py-1"
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
                                  handleRemoveOption(mcqIndex, optionIndex)
                                }
                                disabled={
                                  watch(`${fieldPath}.options`).length <= 2 ||
                                  isSubmitting
                                }
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        )}
                      </RadioGroup>
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {showVideoUpload && (
                <div className="mt-4">
                  <FormLabel className="font-medium">Video:</FormLabel>
                  <Controller
                    name={`${fieldPath}.videoFile`}
                    control={control}
                    render={({ field }) => (
                      <FileUploader
                        onFileUpload={(files) => {
                          if (files && files.length > 0) {
                            field.onChange(files[0]);
                            setValue(`${fieldPath}.videoUrl`, "");
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
                        defaultPreview={defaultVideoUrls[mcqIndex] || undefined}
                        defaultName={defaultVideoNames[mcqIndex] || undefined}
                        disabled={isSubmitting}
                        error={getNestedErrorMessage(`${fieldPath}.videoFile`)}
                        alwaysShowDropzone={false}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex-1"></div>

        <div className="flex justify-end items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddQuestion}
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            + Add New Question
          </Button>
        </div>
      </div>
    </>
  );
}
