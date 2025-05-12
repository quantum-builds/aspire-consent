import Header from "@/components/Header";
import ProcedureQuestionFormsList from "@/app/dentist/(with-layout)/procedures/components/ProceduresList";
import { getDentistProcedure } from "@/services/dentistProcedure/DentistProcedureQuery";
import { Response } from "@/types/common";
import { TDentistProcedure } from "@/types/dentist-procedure";
import ModalForm from "@/app/dentist/(with-layout)/procedures/components/AddProcedureModal";
import { TDentistPractice } from "@/types/dentist-practice";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";

type ProcedureWrapperProps = {
  practiceId: string;
  dentistPractices: TDentistPractice[];
};
export default async function ProcedureWrapper({
  practiceId,
  dentistPractices,
}: ProcedureWrapperProps) {
  let errorMessage = undefined;
  let consentForms: TDentistProcedure[] = [];

  const response: Response<TDentistProcedure[]> = await getDentistProcedure(
    practiceId
  );
  if (response.data) {
    consentForms = response.data;
  } else {
    errorMessage = response.message;
  }

  return (
    <div className="container mx-auto ">
      <Header
        data={SIDE_BAR_DATA}
        practices={dentistPractices}
        showSearch={false}
      />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-2">Procedures</p>
          <p className="text-[#0000004D] mb-5 text-lg">
            Manage and edit your procedure question forms.
          </p>
        </div>

        <ModalForm practiceId={practiceId} />
      </div>
      <ProcedureQuestionFormsList
        data={consentForms}
        errorMessage={errorMessage}
      />
    </div>
  );
}
