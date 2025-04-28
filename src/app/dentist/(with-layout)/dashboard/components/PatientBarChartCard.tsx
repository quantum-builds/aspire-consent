import { getDentistConsentForms } from "@/services/dentist-consentform/DentistConsentFormQuery";
import { Response } from "@/types/common";
import { TConsentFormTimeCountsResponse } from "@/types/dentist-consentForm";
import PatientBarChart from "./PatientBarChart";

type PatientBarChartCardProps = {
  cookieHeader: string;
};
export default async function PatientBarChartCard({
  cookieHeader,
}: PatientBarChartCardProps) {
  let consentFormByDentist: TConsentFormTimeCountsResponse | null = null;
  let errorMessageConsentFormTimeCountsResponse: string | null = null;
  const responseConsentFormTimeCountsResponse: Response<TConsentFormTimeCountsResponse> =
    await getDentistConsentForms(cookieHeader);
  if (responseConsentFormTimeCountsResponse.status) {
    consentFormByDentist = responseConsentFormTimeCountsResponse.data;
  } else {
    errorMessageConsentFormTimeCountsResponse =
      responseConsentFormTimeCountsResponse.message;
  }
  return (
    <PatientBarChart
      data={consentFormByDentist}
      errMessage={errorMessageConsentFormTimeCountsResponse}
    />
  );
}
