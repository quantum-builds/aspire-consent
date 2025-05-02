import { Suspense } from "react";
import ConsentFormSkeleton from "./components/ConsentFormSkeleton";
import ConsentFormWrapper from "./components/ConsentFormWrapper";

export default async function Page(props: {
  searchParams?: Promise<{ practiceId: string }>;
}) {
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || "";
  return (
    <Suspense fallback={<ConsentFormSkeleton />}>
      <ConsentFormWrapper practiceId={practiceId} />
    </Suspense>
  );
}
