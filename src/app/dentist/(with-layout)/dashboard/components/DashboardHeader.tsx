import { Plus } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  practiceId: string;
}

export default function DashboardHeader({ practiceId }: DashboardHeaderProps) {
  return (
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
  );
}
