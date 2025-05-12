import { Suspense } from "react";
import ConsentFormSkeleton from "./components/ConsentFormSkeleton";
import ConsentFormWrapper from "./components/ConsentFormWrapper";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { TDentistPractice } from "@/types/dentist-practice";
import { Response } from "@/types/common";
import { redirect } from "next/navigation";

export default async function Page(props: {
  searchParams?: Promise<{ practiceId: string }>;
}) {
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || "";

  let dentistPractices: TDentistPractice[] = [];
  if (!practiceId) {
    const response: Response<TDentistPractice[]> = await getDentistPractice();
    if (response.status && response.data.length > 0) {
      dentistPractices = response.data;
      redirect(
        `/dentist/new-consent-form?practiceId=${response.data[0].practice.id}`
      );
    }
    redirect(`dentist/new-consent-form?practiceId=${practiceId}`);
  }

  return (
    <Suspense fallback={<ConsentFormSkeleton />}>
      <ConsentFormWrapper
        practiceId={practiceId}
        dentistPractices={dentistPractices}
      />
    </Suspense>
  );
}
