import { getConsentForm } from "@/services/consent-form/ConsentFormQuery";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ConsentFormViewer from "@/app/dentist/(with-layout)/consent-forms/view/[id]/components/ConsentFormViewer";
import { TDentistPractice } from "@/types/dentist-practice";
import { Response } from "@/types/common";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";

interface CustomFormViewerWrapperProps {
    id: string
}
export default async function CustomFormViewerWrapper({ id }: CustomFormViewerWrapperProps) {
    const response = await getConsentForm({ role: "dentist", token: id });

    if (!response.status) {
        return notFound();
    }

    let dentistPractices: TDentistPractice[] = [];
    const dentistPracticeResponse: Response<TDentistPractice[]> =
        await getDentistPractice();

    if (dentistPracticeResponse.status) {
        dentistPractices = dentistPracticeResponse.data;
    }

    return (
        <div className="container mx-auto">
            <Header
                data={SIDE_BAR_DATA}
                practices={dentistPractices}
                showSearch={false}
            />
            <ConsentFormViewer data={response.data} />
        </div>
    );
}