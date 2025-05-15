import Header from "@/components/Header";
import ConsentForm from "./ConsentForm";
import { TDentistProcedure } from "@/types/dentist-procedure";
import { Response } from "@/types/common";
import { getDentistProcedure } from "@/services/dentistProcedure/DentistProcedureQuery";
import { ExtendedTUser } from "@/types/user";
import { getUsers } from "@/services/user/UserQuery";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { TDentistPractice } from "@/types/dentist-practice";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";

interface ConsetFormWrapperProps {
  practiceId: string;
  dentistPractices: TDentistPractice[];
}
export default async function ConsetFormWrapper({
  practiceId,
  dentistPractices,
}: ConsetFormWrapperProps) {
  let procedureErrorMessage = undefined;
  let procedureData: TDentistProcedure[] = [];
  let patientErrorMessage = undefined;
  let patientData: ExtendedTUser[] = [];

  const procedureResponse: Response<TDentistProcedure[]> =
    await getDentistProcedure(practiceId);
  if (procedureResponse.data) {
    procedureData = procedureResponse.data;
  } else {
    procedureErrorMessage = procedureResponse.message;
  }

  const fields = ["id", "fullName", "email"];
  const patientResponse: Response<ExtendedTUser[]> = await getUsers(
    "patient",
    fields
  );
  if (patientResponse.status) {
    patientData = patientResponse.data;
  } else {
    patientErrorMessage = patientResponse.message;
  }

  return (
    <div className="container mx-auto">
      <Header
        data={SIDE_BAR_DATA}
        practices={dentistPractices}
        showSearch={false}
      />
      <div className="flex gap-5">
        <Link href={`/dentist/dashboard?practiceId=${practiceId}`}>
          <MoveLeft height={40} width={20} className="cursor-pointer" />
        </Link>
        <div className="flex flex-col ga-7">
          <p className="text-2xl font-bold mb-2">New Consent</p>
          <p className="text-[#0000004D] mb-5 text-lg">
            Create new consent request to be sent to a patient.
          </p>
        </div>
      </div>

      <ConsentForm
        procedures={procedureData}
        patients={patientData}
        procedureErrorMessage={procedureErrorMessage}
        patientErrorMessage={patientErrorMessage}
        practiceId={practiceId}
      />
    </div>
  );
}
