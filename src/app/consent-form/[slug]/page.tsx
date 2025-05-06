import { Suspense } from "react";
import ConsentFormWrapper from "@/app/consent-form/components/ConsentFormWrapper";
import ConsentFormContentSkeleton from "@/app/consent-form/components/ConsentFormContentSkeleton";

type Params = Promise<{ slug: string }>;
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const token = decodeURIComponent(slug);

  return (
    <Suspense fallback={<ConsentFormContentSkeleton />}>
      <ConsentFormWrapper token={token} />
    </Suspense>
  );
}
