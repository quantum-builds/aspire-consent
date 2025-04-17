import Header from "@/components/Header";
import ConsentForm from "./components/ConsentForm";

export default function Page() {
  return (
    <div className="">
      <Header showSearch={false} />
      <p className="text-2xl font-bold mb-2">New Consent</p>
      <p className="text-[#0000004D] mb-5 text-lg">
        Create new consent request to be sent to a patient.
      </p>
      <ConsentForm />
    </div>
  );
}
