import { getConsentForm } from "@/services/consent-form/ConsentFormQuery";
import { notFound } from "next/navigation";
import ConsentForm from "../../components/ConsentForm";
import Header from "@/components/Header";

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

  return (
    <div className="container mx-auto">
      <Header showSearch={false} />
      <ConsentForm data={response.data} />
    </div>
  );
}
