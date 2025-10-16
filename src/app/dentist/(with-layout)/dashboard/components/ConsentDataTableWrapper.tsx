import { TConsentFormData } from "@/types/consent-form";
import ConsentDataTable from "./ConsentDataTables";
import { Response } from "@/types/common";
import { getConsentTableData } from "@/services/dentist-consentform/DentistConsentFormQuery";

interface ConsentDataTableComponentProps {
  practiceId: string;
}
export default async function ConsentDataTableWrapper({
  practiceId,
}: ConsentDataTableComponentProps) {
  let errMessageConsentTable: string | null = null;
  let consentTable: TConsentFormData[] = [];
  const responseConsentTable: Response<TConsentFormData[]> =
    await getConsentTableData(practiceId);
  if (responseConsentTable.status) {
    consentTable = responseConsentTable.data;
  } else {
    errMessageConsentTable = responseConsentTable.message;
  }
  return (
      <ConsentDataTable
        data={consentTable}
        errorMessage={errMessageConsentTable}
      />
  );
}
