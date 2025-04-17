import Header from "@/components/Header";
import ConsentFormsList from "@/app/dentist/(with-layout)/consent-forms/components/ConsentFormsList";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
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
      <ConsentFormsList />
    </div>
  );
}
