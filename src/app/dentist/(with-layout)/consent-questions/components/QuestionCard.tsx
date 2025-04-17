"use client";
import { useState } from "react";

interface QuestionOption {
  label: string;
  text: string;
}

interface QuestionProps {
  questionText: string;
  options: QuestionOption[];
  answer?: string;
  onNext: () => void;
  onBack: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function QuestionCard({
  questionText,
  options,
  answer,
  onNext,
  onBack,
  isFirst = false,
  isLast = false,
}: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="p-4">
      <h2 className="font-medium mb-4">Question :</h2>
      <div className="mb-4 p-4 border-1">
        <div className="pl-4 mb-6">
          <p className="mb-4">Q: {questionText}</p>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <p className="w-8">{option.label}.</p>
              <p className="flex-1">{option.text}</p>
              <input
                type="checkbox"
                checked={
                  selectedOption === option.label || answer === option.label
                }
                onChange={() => handleOptionSelect(option.label)}
                className="h-4 w-4 border-gray-300 rounded"
              />
            </div>
          ))}
          <div className="mt-4">
            <p>Answers: {answer || selectedOption || ""}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        {!isFirst && (
          <button
            onClick={onBack}
            className="px-5 py-2 border border-gray-300 rounded text-md"
          >
            Back
          </button>
        )}
        {!isLast && (
          <button
            onClick={onNext}
            className="px-5 py-2 bg-[#698AFF] text-white rounded text-md"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
