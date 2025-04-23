import Header from "@/components/Header";
import ConsentForm from "./components/ConsentForm";
import { TDentistProcedure } from "@/types/dentist-procedure";
import { Response } from "@/types/common";
import { getDentistProcedure } from "@/services/dentist-procedure/DentistProcedureQuery";
import { ExtendedTUser } from "@/types/user";
import { getUsers } from "@/services/user/UserQuery";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default async function Page() {
  let procedureErrorMessage = undefined;
  let procedureData: TDentistProcedure[] = [];
  let patientErrorMessage = undefined;
  let patientData: ExtendedTUser[] = [];

  const procedureResponse: Response<TDentistProcedure[]> =
    await getDentistProcedure();
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
    <div className="">
      <Header showSearch={false} />
      <div className="flex items-center gap-4">
        <Link href={"/dentist/dashboard"}>
          <MoveLeft size={30} className="cursor-pointer" />
        </Link>
        <p className="text-2xl font-bold mb-2">New Consent</p>
      </div>
      <p className="text-[#0000004D] mb-5 text-lg">
        Create new consent request to be sent to a patient.
      </p>
      <ConsentForm
        procedures={procedureData}
        patients={patientData}
        procedureErrorMessage={procedureErrorMessage}
        patientErrorMessage={patientErrorMessage}
      />
    </div>
  );
}
