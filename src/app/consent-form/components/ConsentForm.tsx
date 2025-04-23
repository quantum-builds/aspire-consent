import { TConsentForm } from "@/types/consent-form";
import { Response } from "@/types/common";
import { getConsentForm } from "@/services/consent-form/ConsentFormQuery";
import ConsentFormContent from "./ConsentFormContemt";

type ConsentFormProps = {
  token: string;
};
export default async function ConsentForm({ token }: ConsentFormProps) {
  let errorMessage = undefined;
  let consentForm: TConsentForm | null = null;

  const response: Response<TConsentForm> = await getConsentForm(token);

  if (response.status) {
    consentForm = response.data;
  } else if (response.message === "This consent form is no longer available") {
    errorMessage = "This consent form is no longer available";
  } else {
    errorMessage = "Failed to load consent form";
  }

  return (
    <div className="p-6 md:p-12">
      {/* <Header showSearch={false} /> */}
      {errorMessage ? (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
          <h1 className="text-xl font-medium text-gray-800 mb-2">
            Consent Form Unavailable
          </h1>
          <p className="text-red-500">{errorMessage}</p>
        </div>
      ) : (
        <ConsentFormContent data={consentForm} formId={token} />
      )}
    </div>
  );
}
