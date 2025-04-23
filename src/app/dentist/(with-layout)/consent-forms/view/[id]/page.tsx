import { getConsentForm } from "@/services/consent-form/ConsentFormQuery";
import { notFound } from "next/navigation";
import ConsentForm from "../../components/ConsentForm";

type Params = Promise<{ id: string }>;
export default async function ViewConsentFormPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const response = await getConsentForm(id);

  if (!response.status) {
    return notFound();
  }

  return <ConsentForm data={response.data} />;
}
