import Header from "@/components/Header";
import QuestionList from "@/app/dentist/(with-layout)/consent-questions/components/QuestionList";
import { ExtendedTMCQ } from "@/types/mcq";
import { Response } from "@/types/common";
import { getMCQs } from "@/services/mcq/MCQQuery";
import ConsentTitle from "./ConsentTitle";
import { TDentistPractice } from "@/types/dentist-practice";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";

type ConsentQuestionProps = {
  procedureId: string;
};
export default async function ConsentQuestion({
  procedureId,
}: ConsentQuestionProps) {
  let errorMessage = undefined;
  let mcqs: ExtendedTMCQ[] = [];
  let procedureName: string | null = null;

  const response: Response<ExtendedTMCQ[] | string> = await getMCQs(
    procedureId
  );
  if (response.status && Array.isArray(response.data)) {
    mcqs = response.data;
    procedureName = mcqs[0].procedureName;
  } else if (typeof response.data === "string") {
    procedureName = response.data;
    errorMessage = response.message;
  } else {
    errorMessage = response.message;
  }

  let dentistPractices: TDentistPractice[] = [];
  const dentistPracticeResponse: Response<TDentistPractice[]> =
    await getDentistPractice();

  if (dentistPracticeResponse.status) {
    dentistPractices = dentistPracticeResponse.data;
  }

  console.log(errorMessage);
  return (
    <div>
      <Header
        data={SIDE_BAR_DATA}
        practices={dentistPractices}
        showSearch={false}
      />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4">
        <div className="flex flex-col gap-2">
          <ConsentTitle />
          <p className="text-[#0000004D] mb-5 text-lg">
            Review questions and give answers for this treatment.
          </p>
        </div>
      </div>

      <QuestionList
        data={mcqs}
        procedureId={procedureId}
        consentName={procedureName}
      />
    </div>
  );
}
