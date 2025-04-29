import DataTable from "@/app/dentist/(with-layout)/consent-forms/components/ConsentList";
import { getConsentForm } from "@/services/consent-form/ConsentFormQuery";
import { TConsentForm } from "@/types/consent-form";
import { Plus } from "lucide-react";
import { Response } from "@/types/common";
import Link from "next/link";
import Header from "@/components/Header";

export default async function PatientsPage() {
  let errorMessage = undefined;
  let consentForms: TConsentForm[] | null = null;
  const response: Response<TConsentForm[]> = await getConsentForm({
    role: "dentist",
  });

  if (response.status) {
    consentForms = response.data;
  } else {
    errorMessage = response.message;
    // console.log("error is: ", errorMessage);
  }

  return (
    <div className="container mx-auto ">
      <Header showSearch={false} />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-2">New Consent</p>
          <p className="text-[#0000004D] mb-5 text-lg">
            Create new consent request to be sent to a patient.
          </p>
        </div>

        <Link
          className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-3 text-xl px-2 flex items-center justify-center rounded-md "
          href={"/dentist/new-consent-form"}
        >
          <Plus width={20} height={20} className="mr-1" />
          New Consent
        </Link>
      </div>
      <DataTable data={consentForms} error={errorMessage} />
    </div>
  );
}
