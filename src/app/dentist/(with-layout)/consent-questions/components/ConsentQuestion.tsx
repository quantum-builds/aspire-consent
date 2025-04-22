import Header from "@/components/Header";
import QuestionList from "@/app/dentist/(with-layout)/consent-questions/components/QuestionList";
import { ExtendedTMCQ } from "@/types/mcq";
import { Response } from "@/types/common";
import { getMCQs } from "@/services/mcq/MCQQuery";

type ConsentQuestionProps = {
  consentName: string;
};
export default async function ConsentQuestion({
  consentName,
}: ConsentQuestionProps) {
  let errorMessage = undefined;
  let mcqs: ExtendedTMCQ[] = [];
  let procedureId: string | null = null;

  console.log("consent name is ", consentName);

  const response: Response<ExtendedTMCQ[] | string> = await getMCQs(
    consentName
  );
  if (response.status && Array.isArray(response.data)) {
    mcqs = response.data;
    procedureId = mcqs[0].procedureId;
  } else if (typeof response.data === "string") {
    procedureId = response.data;
    errorMessage = response.message;
  } else {
    errorMessage = response.message;
  }

  console.log(errorMessage);
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
        {/* <Link
          className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-2 px-4 text-sm flex items-center justify-center rounded-md"
          href={"/dentist/new-consent-form"}
        >
          <Plus width={16} height={16} className="mr-1" />
          New Consent
        </Link> */}
      </div>

      <QuestionList
        data={mcqs}
        procedureId={procedureId}
        consentName={consentName}
      />
    </div>
  );
}
