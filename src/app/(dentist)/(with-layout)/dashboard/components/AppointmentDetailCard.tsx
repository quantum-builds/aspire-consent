type AppointmentDetailCardProps = {
  treatmentName: string;
  treamtentTime: string;
};

export default function AppointmentDetailCard({
  treatmentName,
  treamtentTime,
}: AppointmentDetailCardProps) {
  return (
    <div className="bg-[#698AFF4D] p-3 rounded-md">
      <p className="text-[#00000080] text-lg">Treatment</p>
      <div className="flex justify-between">
        <p className="text-xl">{treatmentName}</p>
        <p className="text-xl">{treamtentTime}</p>
      </div>
    </div>
  );
}
