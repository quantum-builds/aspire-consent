import AppointmentDetailCard from "./AppointmentDetailCard";

const TREATMENT_DETAIL_CARD_DATA = [
  { name: "Consultation", date: "12-04-25 ", time: "09:00-10:00" },
  { name: "Root Canal", date: "12-04-25 ", time: "09:00-10:00" },
  { name: "Consultation", date: "12-04-25 ", time: "09:00-10:00" },
  { name: "Root Canal", date: "12-04-25 ", time: "09:00-10:00" },
];
export default function AppointmentCard() {
  return (
    <div className="w-full h-full rounded-lg shadow-md p-5">
      <p className="mb-5 text-xl font-normal">
        Treatments This Month ({TREATMENT_DETAIL_CARD_DATA.length})
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 overflow-y-auto h-50">
        {TREATMENT_DETAIL_CARD_DATA.map((data, index) => (
          <AppointmentDetailCard
            key={index}
            treatmentName={data.name}
            treatmentDate={data.date}
            treamtentTime={data.time}
          />
        ))}
      </div>
    </div>
  );
}
