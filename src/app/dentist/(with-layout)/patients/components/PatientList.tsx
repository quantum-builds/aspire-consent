import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Plus, Search, Trash } from "lucide-react";
import Link from "next/link";

type PatientListProps = {
  patientsData: {
    name: string;
    phoneNumber: string;
    email: string;
    dateOfConsent: string;
  }[];
};

export default function PatientList({
  patientsData: treatmentData,
}: PatientListProps) {
  return (
    <div className="flex w-full">
      <Card className="w-full mx-auto shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-3 sm:space-y-0">
          <CardTitle className="text-lg sm:text-2xl font-medium">
            All Patients
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-4/5 justify-start md:justify-end items-start md:items-center">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-2 top-4 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 py-6" />
            </div>
            <Link
              className="bg-white border-1 border-gray-300 text-[#698AFF] cursor-pointer py-2 text-lg px-3  flex items-center justify-center rounded-md "
              href={"/dentist/new-consent-form"}
            >
              <Plus width={20} height={20} className="mr-1" />
              Add New Patient
            </Link>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[#e3e3ff] text-gray-800 rounded-md">
                  <th className="p-3">Patient name</th>
                  <th className="p-3">Phone number</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Date of Consent</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatmentData.map((item, idx) => (
                  <tr key={idx} className="bg-white rounded-md shadow-sm">
                    <td className="p-3 font-medium text-gray-700">
                      {item.name}
                    </td>
                    <td className="p-3 text-gray-700">{item.phoneNumber}</td>
                    <td className="p-3 text-gray-700">{item.email}</td>
                    <td className="p-3 text-gray-700">{item.dateOfConsent}</td>

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
        </CardContent>
      </Card>
    </div>
  );
}
