import { Suspense } from "react";
import ConsentQuestion from "../components/ConsentQuestion";

type Params = Promise<{ slug: string }>;
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const consentName = decodeURIComponent(slug);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1D120C]"></div>
        </div>
      }
    >
      <ConsentQuestion consentName={consentName} />
    </Suspense>
  );
}
