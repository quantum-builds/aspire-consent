import Header from "@/components/Header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import RadialProgressCHartCard from "./RadialProgressChartCard";
import PatientBarChartCard from "./PatientBarChartCard";
import { TDentistPractice } from "@/types/dentist-practice";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";
import ConsentDataTableWrapper from "./ConsentDataTableWrapper";
import DashboardCardWrapper from "./DashBoardCardWrapper";

interface DashboardWrapperProps {
  practiceId: string;
  dentistPractices: TDentistPractice[];
}
export default async function DashboardWrapper({
  practiceId,
  dentistPractices,
}: DashboardWrapperProps) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-3">Dashboard</p>
          <p className="text-[#0000004D] mb-6">17th April 2025</p>
        </div>
        <Link
          className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-3 text-xl px-2 flex items-center justify-center rounded-md"
          href={`/dentist/new-consent-form?practiceId=${practiceId}`}
        >
          <Plus width={20} height={20} className="mr-1" />
          New Consent
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-5">
        <div className="col-span-1 lg:col-span-3">
          <DashboardCardWrapper practiceId={practiceId} />
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
