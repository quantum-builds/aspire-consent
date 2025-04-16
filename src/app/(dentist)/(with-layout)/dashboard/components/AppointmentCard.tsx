import AppointmentDetailCard from "./AppointmentDetailCard";

const TREATMENT_DETAIL_CARD_DATA = [
  { name: "Consultation", time: "09:00-10:00" },
  { name: "Root Canal", time: "09:00-10:00" },
];
export default function AppointmentCard() {
  return (
    <div className="w-full h-full rounded-lg shadow-md p-5">
      <p className="mb-5 text-xl font-normal">
        Today’s Appointment ({TREATMENT_DETAIL_CARD_DATA.length})
      </p>
      <div className="flex flex-col gap-4 ">
        {TREATMENT_DETAIL_CARD_DATA.map((data, index) => (
          <AppointmentDetailCard
            key={index}
            treatmentName={data.name}
            treamtentTime={data.time}
          />
        ))}
      </div>
    </div>
  );
}
