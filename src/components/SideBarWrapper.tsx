import { StaticImageData } from "next/image";
import SideBar from "./SideBar";
import { TDentistPractice } from "@/types/dentist-practice";
import { Response } from "@/types/common";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";

interface SideBarWrapperProps {
  data: { text: string; logo: StaticImageData; link: string }[];
}
export default async function SideBarWrapper({ data }: SideBarWrapperProps) {
  let dentistPractices: TDentistPractice[] = [];
  const dentistPracticeResponse: Response<TDentistPractice[]> =
    await getDentistPractice();

  if (dentistPracticeResponse.status) {
    dentistPractices = dentistPracticeResponse.data;
  }

  return (
    <SideBar data={data} practices={dentistPractices} />
  );
}
