import Header from "@/components/Header";
import { Plus } from "lucide-react";
import Link from "next/link";
import QuestionList from "@/app/dentist/(with-layout)/consent-questions/components/QuestionList";

export default async function Page({
  params,
}: {
  params: Promise<{ consentName: string }>;
}) {
  // const consentName = params.slug;
  const { consentName } = await params;

  if (!consentName) {
    return (
      <div className="flex justify-center items-center">
        <p className="font-bold font-gillSans text-lg">Invalid Consent</p>
      </div>
    );
  }

  return (
    <div>
      <Header showSearch={false} />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-2">View Questions</p>
          <p className="text-[#0000004D] mb-5 text-lg">
            Review questions and give answers for this treatment.
          </p>
        </div>
        <Link
          className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-2 px-4 text-sm flex items-center justify-center rounded-md"
          href={"/dentist/new-consent-form"}
        >
          <Plus width={16} height={16} className="mr-1" />
          New Consent
        </Link>
      </div>

      <QuestionList />
    </div>
  );
}
