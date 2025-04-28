import { TConsentFormData } from "@/types/consent-form";
import ConsentDataTable from "./ConsentDataTables";
import { Response } from "@/types/common";
import { getConsentTableData } from "@/services/dentist-consentform/DentistConsentFormQuery";

type ConsentDataTableComponentProps = {
  cookieHeader: string;
};
export default async function ConsentDataTableComponent({
  cookieHeader,
}: ConsentDataTableComponentProps) {
  let errMessageConsentTable: string | null = null;
  let consentTable: TConsentFormData[] = [];
  const responseConsentTable: Response<TConsentFormData[]> =
    await getConsentTableData(cookieHeader);
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
