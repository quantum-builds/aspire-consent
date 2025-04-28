import { getConsentFormByStatus } from "@/services/dentist-consentform/DentistConsentFormQuery";
import { Response } from "@/types/common";
import { TConsentFormStatus } from "@/types/dentist-consentForm";
import RadialProgressChart from "./RadialProgressChart";

type RadialProgressCHartCardProps = {
  cookieHeader: string;
};
export default async function RadialProgressCHartCard({
  cookieHeader,
}: RadialProgressCHartCardProps) {
  let consentFormByStatus: TConsentFormStatus | null = null;
  let errorMessageConsentFormByStatus: string | null = null;

  const responseConsentFormByStatus: Response<TConsentFormStatus> =
    await getConsentFormByStatus(cookieHeader);
  if (responseConsentFormByStatus.status) {
    consentFormByStatus = responseConsentFormByStatus.data;
  } else {
    errorMessageConsentFormByStatus = responseConsentFormByStatus.message;
  }
  return (
    <RadialProgressChart
      data={consentFormByStatus}
      errorMessage={errorMessageConsentFormByStatus}
    />
  );
}
