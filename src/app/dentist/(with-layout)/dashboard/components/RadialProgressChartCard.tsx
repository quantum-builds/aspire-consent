import { getConsentFormByStatus } from "@/services/dentist-consentform/DentistConsentFormQuery";
import { Response } from "@/types/common";
import { TConsentFormStatus } from "@/types/dentist-consentForm";
import RadialProgressChart from "./RadialProgressChart";
import { Suspense } from "react";
import RadialProgessChartSkeleton from "./skeleton/RadialProgressChartSkeleton";

interface RadialProgressCHartCardProps {
  practiceId: string;
}
export default async function RadialProgressCHartCard({
  practiceId,
}: RadialProgressCHartCardProps) {
  let consentFormByStatus: TConsentFormStatus | null = null;
  let errorMessageConsentFormByStatus: string | null = null;

  const responseConsentFormByStatus: Response<TConsentFormStatus> =
    await getConsentFormByStatus(practiceId);
  if (responseConsentFormByStatus.status) {
    consentFormByStatus = responseConsentFormByStatus.data;
  } else {
    errorMessageConsentFormByStatus = responseConsentFormByStatus.message;
  }
  return (
    <Suspense key={practiceId} fallback={<RadialProgessChartSkeleton />}>
      <RadialProgressChart
        data={consentFormByStatus}
        errorMessage={errorMessageConsentFormByStatus}
      />
    </Suspense>
  );
}
