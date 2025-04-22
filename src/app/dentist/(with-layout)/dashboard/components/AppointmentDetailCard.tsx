type AppointmentDetailCardProps = {
  treatmentName: string;
  treatmentDate: string;
  treamtentTime: string;
};

export default function AppointmentDetailCard({
  treatmentName,
  treatmentDate,
  treamtentTime,
}: AppointmentDetailCardProps) {
  return (
    <div className="bg-[#698AFF4D] p-3 rounded-md">
      <p className="text-[#00000080] text-lg">Treatment</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <p className="text-xl">{treatmentName}</p>
        <div className="flex flex-col 2xl:flex-row gap-3">
          <p className="text-xl">{treatmentDate}</p>
          <p className="text-xl">{treamtentTime}</p>
        </div>
      </div>
    </div>
  );
}
