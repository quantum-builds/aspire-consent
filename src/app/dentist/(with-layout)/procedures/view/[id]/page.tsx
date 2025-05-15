import Header from "@/components/Header";
import { TDentistPractice } from "@/types/dentist-practice";
import { Response } from "@/types/common";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";
import { ExtendedTMCQ } from "@/types/mcq";
import { getMCQs } from "@/services/mcq/MCQQuery";
import QuestionsList from "@/app/dentist/components/QuestionsList";

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
      <div className="flex flex-col max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4">
          <div className="flex flex-col gap-2">
            {/* <ConsentTitle /> */}
            <p className="text-2xl font-bold mb-2">View Questions</p>
            <p className="text-[#0000004D] mb-5 text-lg">
              Review questions for this procedure.
            </p>
          </div>
        </div>
        <QuestionsList data={mcqs} answers={null} isProcedure={true} />
      </div>
    </div>
  );
}
