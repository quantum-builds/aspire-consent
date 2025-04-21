import { Suspense } from "react";
import ConsentForm from "../components/ConsentForm";

type Params = Promise<{ slug: string }>;
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const token = decodeURIComponent(slug);
  console.log("token is ", token);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1D120C]"></div>
        </div>
      }
    >
      <ConsentForm token={token} />
    </Suspense>
  );
}
