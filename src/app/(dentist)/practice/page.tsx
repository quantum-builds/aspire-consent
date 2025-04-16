import { Suspense } from "react";
import PracticeForm from "@/app/(dentist)/practice/components/PracticeForm";
import { getAllPractices } from "@/services/practice/PraticeQuery";
import { Response } from "@/types/common";
import { TPractice } from "@/types/practices";

export default async function Home() {
  let practices: TPractice[] = [];
  let errorMessage = null;
  const response: Response<TPractice[]> = await getAllPractices();
  if (response.status) {
    practices = response.data;
  } else {
    errorMessage = response.message;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <PracticeForm practices={practices} errorMessage={errorMessage} />
        </Suspense>
      </div>
    </main>
  );
}
