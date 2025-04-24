import { Suspense } from "react";
import ConsentQuestion from "@/app/dentist/(with-layout)/consent-questions/components/ConsentQuestion";
import QuestionFormSkeleton from "@/app/dentist/(with-layout)/consent-questions/components/QuestionFormSkeleton";

type Params = Promise<{ slug: string }>;
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const procedureId = decodeURIComponent(slug);
  return (
    <Suspense fallback={<QuestionFormSkeleton />}>
      <ConsentQuestion procedureId={procedureId} />
    </Suspense>
  );
}
