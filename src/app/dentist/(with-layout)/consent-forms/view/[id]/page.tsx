import { Suspense } from "react";
import ConsentFormViewerSkeleton from "./components/skeleton/CustomFormViewer";
import CustomFormViewerWrapper from "./components/CustomFormViewerWrapper";


type Params = Promise<{ id: string }>;
export default async function ViewConsentFormPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  return (
    <Suspense key={id} fallback={<ConsentFormViewerSkeleton />}>
      <CustomFormViewerWrapper id={id} />
    </Suspense>
  )
}
