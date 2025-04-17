"use client";
import { useState } from "react";
import { QuestionCard } from "@/app/dentist/(with-layout)/consent-questions/components/QuestionCard";

const CONSENT_QUESTIONS = [
  {
    questionText:
      "How long does typical orthodontic treatment with braces last?",
    options: [
      { label: "A", text: "2–4 months" },
      { label: "B", text: "4–6 months" },
      { label: "C", text: "6 months – 1 year" },
      { label: "D", text: "1–3 years" },
    ],
    answer: "D",
  },
  {
    questionText: "What is the recommended frequency for adjusting braces?",
    options: [
      { label: "A", text: "Every week" },
      { label: "B", text: "Every 2-3 weeks" },
      { label: "C", text: "Every 4-6 weeks" },
      { label: "D", text: "Every 6 months" },
    ],
    answer: "C",
  },
  {
    questionText: "What is a common side effect after braces adjustment?",
    options: [
      { label: "A", text: "Temporary discomfort" },
      { label: "B", text: "Permanent tooth sensitivity" },
      { label: "C", text: "Bleeding gums" },
      { label: "D", text: "Tooth discoloration" },
    ],
    answer: "A",
  },
  {
    questionText: "How often should patients with braces brush their teeth?",
    options: [
      { label: "A", text: "Once a day" },
      { label: "B", text: "After every meal" },
      { label: "C", text: "Twice a day" },
      { label: "D", text: "Only in the morning" },
    ],
    answer: "B",
  },
  {
    questionText: "What foods should be avoided with braces?",
    options: [
      { label: "A", text: "Soft foods" },
      { label: "B", text: "Hard and sticky foods" },
      { label: "C", text: "Cooked vegetables" },
      { label: "D", text: "Dairy products" },
    ],
    answer: "B",
  },
];


export default function QuestionList() {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 1; // We'll show one actual question per page
  const totalPages = Math.ceil(CONSENT_QUESTIONS.length / questionsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current question
  const indexOfCurrentQuestion = currentPage;
  const currentQuestion = CONSENT_QUESTIONS[indexOfCurrentQuestion];

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-lg font-semibold mb-4">
          Questions for Orthodontic Treatment
        </h1>

        {/* First question - the actual question from the data */}
        <QuestionCard
          key={`question-${indexOfCurrentQuestion}`}
          questionText={currentQuestion.questionText}
          options={currentQuestion.options}
          answer={currentQuestion.answer}
          onNext={handleNextPage}
          onBack={handlePrevPage}
          isFirst={currentPage === 0}
          isLast={currentPage === totalPages - 1}
        />

        {/* Second question - always empty and disabled */}
        {currentPage !== totalPages - 1 && (
          <div className="p-4 border-t mt-4 pt-6">
            <div className="mb-4">
              <h2 className="font-medium mb-4">Question :</h2>
              <div className="p-4 mb-6 border-1">
                <p className="mb-4">Q: </p>
                <div>
                  <div className="flex items-center mb-2">
                    <p className="w-8">A.</p>
                    <p className="flex-1"></p>
                    <div className="h-4 w-4 border border-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="w-8">B.</p>
                    <p className="flex-1"></p>
                    <div className="h-4 w-4 border border-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="w-8">C.</p>
                    <p className="flex-1"></p>
                    <div className="h-4 w-4 border border-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="w-8">D.</p>
                    <p className="flex-1"></p>
                    <div className="h-4 w-4 border border-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="mt-4">
                  <p>Answers: </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-5 py-2 border border-gray-300 rounded text-md opacity-50 cursor-not-allowed"
                disabled
              >
                Back
              </button>
              <button
                className="px-5 py-2 bg-[#698AFF] text-white rounded text-md opacity-50 cursor-not-allowed"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-start gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          className={`px-5 py-2 border rounded ${
            currentPage === 0
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 cursor-pointer"
          }`}
          disabled={currentPage === 0}
        >
          Go back
        </button>
        <button
          onClick={handleNextPage}
          className={`px-5 py-2 bg-[#698AFF] cursor-pointer text-white rounded`}
          disabled={currentPage === totalPages - 1}
        >
          {currentPage === totalPages - 1 ? "Save" : "Next"}
        </button>
      </div>
    </>
  );
}
