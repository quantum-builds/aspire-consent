import { getConsentForm } from "@/services/consent-form/ConsentFormQuery";
import { notFound } from "next/navigation";
import ConsentFormEditor from "@/app/dentist/(with-layout)/consent-forms/edit/[id]/components/ConsentFormEditor";
import Header from "@/components/Header";
import { TDentistPractice } from "@/types/dentist-practice";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { Response } from "@/types/common";
import { SIDE_BAR_DATA } from "@/constants/SideBarData";

interface ConsentFormEditorWrapperProps {
    id: string
}
export default async function ConsentFormEditorWrapper({ id }: ConsentFormEditorWrapperProps) {
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
        <>
            <Header
                data={SIDE_BAR_DATA}
                practices={dentistPractices}
                showSearch={false}
            />
            <ConsentFormEditor data={response.data} formId={id} />;
        </>
    )
}