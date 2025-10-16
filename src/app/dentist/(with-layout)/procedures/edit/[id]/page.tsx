import { Suspense } from "react";
import ProcedureQuestionsEditorWrapper from "./components/ProcedureQuestionsEditorWrapper";
import ProcedureQuestionEditor from "./components/skeleton/ProcedureQuestionEditor";

type Params = Promise<{ id: string }>;
export default async function ViewProcedurePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return (
    <Suspense key={id} fallback={<ProcedureQuestionEditor/>}>
      <ProcedureQuestionsEditorWrapper id={id} />
    </Suspense>
  )
}
