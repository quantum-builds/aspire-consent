import Header from "@/components/Header";
import ConsentStatus from "./components/ConsentStatusGraph";
import { PendingConsent } from "./components/PendingConsents";
import PatientBarChart from "@/app/dentist/(with-layout)/dashboard/components/PatientBarChart";
import { ConsentEducation, VideoItem } from "./components/ConsentEducation";
import { Procedure, UpcomingProcedures } from "./components/UpcomingProcedure";

const VIDEO_DATA: VideoItem[] = [
  {
    id: "1",
    title: "What to expect in tooth scaling?",
    watched: true,
  },
  {
    id: "2",
    title: "What to expect in tooth scaling?",
    watched: true,
  },
  {
    id: "3",
    title: "What to expect in tooth scaling?",
    watched: true,
  },
  {
    id: "4",
    title: "What to expect in tooth scaling?",
    watched: true,
  },
];

const PROCEDURE_DATA: Procedure[] = [
  {
    id: "1",
    name: "Root Canal",
    date: "12-04-25",
    time: "12:00 am",
    status: "Scheduled",
  },
  {
    id: "2",
    name: "Root Canal",
    date: "12-04-25",
    time: "12:00 am",
    status: "Completed",
  },
  {
    id: "3",
    name: "Root Canal",
    date: "12-04-25",
    time: "12:00 am",
    status: "Pending",
  },
  {
    id: "4",
    name: "Root Canal",
    date: "12-04-25",
    time: "12:00 am",
    status: "Cancelled",
  },
];
export default function Page() {
  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-3">Dashboard</p>
          <p className="text-[#0000004D] mb-6">17th April 2025</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-5">
        <div className="col-span-1 lg:col-span-2">
          <ConsentStatus />
        </div>
        <div className="hidden lg:flex  lg:col-span-1">
          <PendingConsent
            title="Tooth Extraction"
            description="Complete now"
            progress={25}
          />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <PatientBarChart />
        </div>
        <div className="hidden lg:flex  lg:col-span-1">
          <ConsentEducation videos={VIDEO_DATA} />
        </div>

        <div className="lg:hidden grid md:grid-cols-2 grid-cols-1 gap-3">
          <div className="span-col-1">
            <PendingConsent
              title="Tooth Extraction"
              description="Complete now"
              progress={25}
            />
          </div>
          <div className="span-col-1">
            <ConsentEducation videos={VIDEO_DATA} />
          </div>
        </div>
        {/* 
        {/* <div className="">
            <RadialProgressChart />
          </div>
          <div className="">
            <AppointmentCard />
          </div>
        </div> 
        <div className="flex lg:hidden">
          <AppointmentCard />
        </div> */}
        <div className="col-span-full">
          <UpcomingProcedures procedures={PROCEDURE_DATA} />
        </div>
      </div>
    </>
  );
}
