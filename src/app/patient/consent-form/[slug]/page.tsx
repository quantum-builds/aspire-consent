import { Suspense } from "react";
import ConsentForm from "@/app/patient/consent-form/components/ConsentForm";
import ConsentFormContentSkeleton from "@/app/patient/consent-form/components/ConsentFormContentSkeleton";

type Params = Promise<{ slug: string }>;
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const token = decodeURIComponent(slug);
  console.log("token is ", token);
  return (
    <Suspense fallback={<ConsentFormContentSkeleton />}>
      <ConsentForm token={token} />
    </Suspense>
  );
}
