import { Suspense } from "react";
import ConsentFormWrapper from "@/app/consent-form/components/ConsentFormWrapper";
import { VideoQuestionViewerSkeleton } from "../components/VideoQuestionSkeleton";

type Params = Promise<{ slug: string }>;
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const token = decodeURIComponent(slug);

  return (
    <Suspense fallback={<VideoQuestionViewerSkeleton />}>
      <ConsentFormWrapper token={token} />
    </Suspense>
  );
}
