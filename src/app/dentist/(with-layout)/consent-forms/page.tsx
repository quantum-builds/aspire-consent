import Header from "@/components/Header";
import ConsentFormsList from "@/app/dentist/(with-layout)/consent-forms/components/ConsentFormsList";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getDentistProcedure } from "@/services/dentist-procedure/DentistProcedureQuery";
import { Response } from "@/types/common";
import { TDentistProcedure } from "@/types/dentist-procedure";

export default async function Page() {
  // console.log("data is ", useSession());
  let errorMessage = undefined;
  let consentForms: TDentistProcedure[] = [];

  const response: Response<TDentistProcedure[]> = await getDentistProcedure();
  if (response.data) {
    consentForms = response.data;
  } else {
    errorMessage = response.message;
  }

  return (
    <div>
      <Header showSearch={false} />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-2">Consent Forms</p>
          <p className="text-[#0000004D] mb-5 text-lg">
            Manage and edit your consent forms for each treatment.
          </p>
        </div>

        <Link
          className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-4 text-xl px-3 flex items-center justify-center rounded-md "
          href={"/dentist/new-consent-form"}
        >
          <Plus width={20} height={20} className="mr-1" />
          New Consent
        </Link>
      </div>
      <ConsentFormsList data={consentForms} errorMessage={errorMessage} />
    </div>
  );
}
