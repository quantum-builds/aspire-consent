import { PatientStatus } from "@/constants/Status";
import { Edit, Eye, Trash } from "lucide-react";

type TreatmentCardType = {
  treatmentData: {
    name: string;
    procedure: string;
    date: string;
    status: string;
  }[];
};

export default function TreatmentCard({ treatmentData }: TreatmentCardType) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case PatientStatus.COMPLETE:
        return "#e100ff";
      case PatientStatus.PENDING:
        return "#7b68ee";
      default:
        return "#ccc";
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <p className="text-lg font-semibold mb-4">Recent Treatments</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-[#e3e3ff] text-gray-800 rounded-md">
              <th className="p-3">Patient name</th>
              <th className="p-3">Procedure</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatmentData.map((item, idx) => (
              <tr key={idx} className="bg-white rounded-md shadow-sm">
                <td className="p-3 font-medium text-gray-700">{item.name}</td>
                <td className="p-3 text-gray-700">{item.procedure}</td>
                <td className="p-3 text-gray-700">{item.date}</td>
                <td className="p-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    ></div>
                    <span>{item.status}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-3 text-[#7b68ee]">
                    <Edit className="w-5 h-5 cursor-pointer" />
                    <Eye className="w-5 h-5 cursor-pointer" />
                    <Trash className="w-5 h-5 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
