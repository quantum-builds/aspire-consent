"use client";
import { useState } from "react";
import ConsentFormContent from "./ConsentFormContemt";
import { VideoQuestionViewer } from "./VideoQuestionViewer";
import { TConsentForm } from "@/types/consent-form";

type ConsentFormProps = {
  consentForm: TConsentForm | null;
  token: string;
};

export default function ConsentForm({ consentForm, token }: ConsentFormProps) {
  // const [isOpen, setIsOpen] = useState("");
  const [currentPage, setCurrentPage] = useState<"videos" | "mcqs">("videos");
  return (
    <>
      {/* dentistEmail={consentForm?.dentist.email} */}
      {currentPage === "videos" ? (
        <VideoQuestionViewer
          data={consentForm}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <ConsentFormContent
          data={consentForm}
          formId={token}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}
