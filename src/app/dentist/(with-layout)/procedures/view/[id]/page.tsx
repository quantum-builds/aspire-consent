import { Suspense } from "react";
import ViewProcedureWrapper from "./component/ViewProcedureWrapper";
import ViewProcedureWrapperSkeleton from "./component/skeleton/ViewProcedure";

type Params = Promise<{ id: string }>;
export default async function ViewProcedurePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  return (
    <Suspense key={id} fallback={<ViewProcedureWrapperSkeleton/> }>
      <ViewProcedureWrapper id={id} />
    </Suspense>
  )
}
