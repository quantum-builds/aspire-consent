import { Suspense } from "react";
import ConsentFormEditorWrapper from "./components/ConsentFormEditorWrapper";
import ConsentFormEditorSkeleton from "./components/skeleton/ConsentFormEditor";

type Params = Promise<{ id: string }>;
export default async function ViewConsentFormPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return (
    <Suspense key={id} fallback={<ConsentFormEditorSkeleton />}>
      <ConsentFormEditorWrapper id={id} />
    </Suspense>
  );
}
