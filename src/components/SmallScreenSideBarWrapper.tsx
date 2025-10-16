import { StaticImageData } from "next/image";
import SideBar from "./SideBar";
import { TDentistPractice } from "@/types/dentist-practice";
import { Response } from "@/types/common";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";

interface SmallScreenSideBarWrapperProps {
  data: { text: string; logo: StaticImageData; link: string }[];
}
export default async function SmallScreenSideBarWrapper({
  data,
}: SmallScreenSideBarWrapperProps) {
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
