import { PatientStatus } from "@/constants/Status";
import Header from "@/components/Header";
import PatientBarChart from "./components/PatientBarChart";
import AppointmentPieChart from "./components/AppointmentPieChart";
import RadialProgressChart from "./components/RadialProgressChart";
import AppointmentCard from "./components/AppointmentCard";
import TreatmentCard from "./components/TreatmentCard";
import { Plus } from "lucide-react";
import Link from "next/link";

const TREATMENT_DATA = [
  {
    name: "Josphin",
    procedure: "Root Canal",
    date: "12-04-25 12:00 am",
    status: PatientStatus.PENDING,
  },
  {
    name: "Josphin",
    procedure: "Root Canal",
    date: "12-04-25 12:00 am",
    status: PatientStatus.COMPLETE,
  },
  {
    name: "Josphin",
    procedure: "Root Canal",
    date: "12-04-25 12:00 am",
    status: PatientStatus.PENDING,
  },
];
export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-3">Dashboard</p>
          <p className="text-[#0000004D] mb-6">17th April 2025</p>
        </div>
        <Link
          className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-4 text-xl px-3 flex items-center justify-center rounded-md"
          href={"/dentist/new-consent-form"}
        >
          <Plus width={20} height={20} className="mr-1" />
          New Consent
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-5">
        <div className="col-span-1 lg:col-span-2">
          <PatientBarChart />
        </div>
        <div className="hidden lg:flex  lg:col-span-1">
          <AppointmentPieChart />
        </div>

        <div className="lg:hidden grid md:grid-cols-2 grid-cols-1 gap-3">
          <div className="span-col-1">
            <AppointmentPieChart />
          </div>
          <div className="span-col-1">
            <RadialProgressChart />
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 col-span-3 gap-3">
          {/*  */}
          <div className="col-span-1">
            <RadialProgressChart />
          </div>
          {/*  */}
          <div className="col-span-1 xl:col-span-2">
            <AppointmentCard />
          </div>
        </div>
        <div className="flex lg:hidden">
          <AppointmentCard />
        </div>
        <div className="col-span-full">
          <TreatmentCard treatmentData={TREATMENT_DATA} />
        </div>
      </div>
    </>
  );
}
