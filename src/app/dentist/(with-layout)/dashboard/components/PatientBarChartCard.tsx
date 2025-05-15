import { getDentistConsentForms } from "@/services/dentist-consentform/DentistConsentFormQuery";
import { Response } from "@/types/common";
import { TConsentFormTimeCountsResponse } from "@/types/dentist-consentForm";
import PatientBarChart from "./PatientBarChart";

interface PatientBarChartCardProps {
  cookieHeader: string;
  practiceId: string;
}
export default async function PatientBarChartCard({
  cookieHeader,
  practiceId,
}: PatientBarChartCardProps) {
  let consentFormByDentist: TConsentFormTimeCountsResponse | null = null;
  let errorMessageConsentFormTimeCountsResponse: string | null = null;
  const responseConsentFormTimeCountsResponse: Response<TConsentFormTimeCountsResponse> =
    await getDentistConsentForms(cookieHeader, practiceId);
  if (responseConsentFormTimeCountsResponse.status) {
    consentFormByDentist = responseConsentFormTimeCountsResponse.data;
  } else {
    errorMessageConsentFormTimeCountsResponse =
      responseConsentFormTimeCountsResponse.message;
  }
  // console.log("chart data is ", consentFormByDentist);
  return (
    <PatientBarChart
      data={consentFormByDentist}
      errMessage={errorMessageConsentFormTimeCountsResponse}
    />
  );
}
