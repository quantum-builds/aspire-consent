import Header from "@/components/Header";
import { cookies } from "next/headers";
import RadialProgressCHartCard from "./RadialProgressChartCard";
import PatientBarChartCard from "./PatientBarChartCard";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";
import ConsentDataTableWrapper from "./ConsentDataTableWrapper";
import DashboardCardWrapper from "./DashBoardCardWrapper";
import DashboardHeaderWrapper from "./DashboardHeaderWrapper";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { TDentistPractice } from "@/types/dentist-practice";
import { Response } from "@/types/common";
import { redirect } from "next/navigation";
import DashboardCardSkeleton from "./skeleton/DashboardCardSkeleton";
import { Suspense } from "react";

interface DashboardWrapperProps {
  practiceId: string;
}
export default async function DashboardWrapper({
  practiceId,
}: DashboardWrapperProps) {

  let dentistPractices: TDentistPractice[] = [];
  if (!practiceId) {
    const response: Response<TDentistPractice[]> = await getDentistPractice();
    if (response.status && response.data.length > 0) {
      dentistPractices = response.data;
      redirect(`/dentist/dashboard?practiceId=${response.data[0].practice.id}`);
    }
    redirect(`dentist/dashboard?practiceId=${practiceId}`);
  }
  
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return (
    <>
      <Header
        data={SIDE_BAR_DATA}
        practices={dentistPractices}
        showSearch={false}
      />
      <DashboardHeaderWrapper practiceId={practiceId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-5">
        <div className="col-span-1 lg:col-span-3">
          <Suspense key={practiceId} fallback={<DashboardCardSkeleton />}>
            <DashboardCardWrapper practiceId={practiceId} />
          </Suspense>

        </div>
        <div className="col-span-1 lg:col-span-2">
          <PatientBarChartCard
            cookieHeader={cookieHeader}
            practiceId={practiceId}
          />
        </div>
        <div className="col-span-1">
          <RadialProgressCHartCard
            cookieHeader={cookieHeader}
            practiceId={practiceId}
          />
        </div>

        <div className="col-span-full">
          <ConsentDataTableWrapper
            cookieHeader={cookieHeader}
            practiceId={practiceId}
          />
        </div>
      </div>
    </>
  );
}
