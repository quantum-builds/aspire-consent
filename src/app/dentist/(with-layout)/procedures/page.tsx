import { Suspense } from "react";
import ProcedureWrapper from "./components/ProcedureWrapper";
import ProceduresListSkeleton from "./components/ProcedureListSkeleton";

export default async function Page(props: {
  searchParams?: Promise<{ practiceId: string }>;
}) {
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || "";
  return (
    <Suspense fallback={<ProceduresListSkeleton />}>
      <ProcedureWrapper practiceId={practiceId} />
    </Suspense>
  );
}
