import Header from "@/components/Header";
import { TDentistPractice } from "@/types/dentist-practice";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { Response } from "@/types/common";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";
import { ExtendedTMCQ } from "@/types/mcq";
import { getMCQs } from "@/services/mcq/MCQQuery";
import ProcedureQuestionsEditor from "./components/ProcedureQuestionsEditor";

type Params = Promise<{ id: string }>;
export default async function ViewProcedurePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  let mcqs: ExtendedTMCQ[] = [];
  const response: Response<ExtendedTMCQ[] | string> = await getMCQs(id);
  if (response.status && Array.isArray(response.data)) {
    mcqs = response.data;
  }

  let dentistPractices: TDentistPractice[] = [];
  const dentistPracticeResponse: Response<TDentistPractice[]> =
    await getDentistPractice();

  if (dentistPracticeResponse.status) {
    dentistPractices = dentistPracticeResponse.data;
  }

  return (
    <div>
      <Header
        data={SIDE_BAR_DATA}
        practices={dentistPractices}
        showSearch={false}
      />
      <ProcedureQuestionsEditor data={mcqs} formId={id} />;
    </div>
  );
}
