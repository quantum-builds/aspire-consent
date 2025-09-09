import { Suspense } from "react";
import DashboardHeader from "./DashboardHeader";
import HeaderSkeleton from "./skeleton/HeaderSkeleton";

interface DashboardHeaderWrapperProps {
  practiceId: string;
}

export default function DashboardHeaderWrapper({
  practiceId,
}: DashboardHeaderWrapperProps) {
  return (
    <Suspense key={practiceId} fallback={<HeaderSkeleton />}>
      <DashboardHeader practiceId={practiceId} />;
    </Suspense>
  );
}
