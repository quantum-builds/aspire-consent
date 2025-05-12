import { Suspense } from "react";
import { DashboardSkeleton } from "@/app/dentist/(with-layout)/dashboard/components/DashboardSkeleton";
import DashboardWrapper from "./components/DashboardWrapper";

export default async function Page(props: {
  searchParams?: Promise<{ practiceId: string }>;
}) {
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || "";
  console.log("practice id ", practiceId);
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardWrapper />
    </Suspense>
  );
}
