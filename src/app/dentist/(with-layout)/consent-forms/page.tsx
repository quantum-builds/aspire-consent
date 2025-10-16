import { Suspense } from "react";
import ConsentFormsPageSkeleton from "./components/skeleton/ConsentPageSkeleton";
import ConsentWrapper from "./components/ConsentWrapper";

export default async function Page(props: {
  searchParams?: Promise<{ practiceId: string }>;
}) {
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || "";

  return (
    <Suspense fallback={<ConsentFormsPageSkeleton />}>
      <ConsentWrapper
        practiceId={practiceId}
      />
    </Suspense>
  );
}
