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
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <VideoQuestionViewer
        data={consentForm?.snapshotMCQs}
        dentistEmail={consentForm?.dentist.email}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <ConsentFormContent
        data={consentForm}
        formId={token}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
