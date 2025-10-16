import DashboardHeader from "./DashboardHeader";

interface DashboardHeaderWrapperProps {
  practiceId: string;
}

export default function DashboardHeaderWrapper({
  practiceId,
}: DashboardHeaderWrapperProps) {
  return (
      <DashboardHeader practiceId={practiceId} />
  );
}
