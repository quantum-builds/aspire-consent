// "use client";
// import SearchInput from "@/components/SearchInput";
// import { Bell } from "lucide-react";
// import ProfilePiceDropDown from "@/components/ProfilePicDropDown";
// import { TDentistPractice } from "@/types/dentist-practice";
// import { StaticImageData } from "next/image";
// import { useEffect, useState } from "react";
// import SideBar from "./SideBar";

// type HeaderProps = {
//   practices: TDentistPractice[];
//   data: { text: string; logo: StaticImageData; link: string }[];
//   showSearch?: boolean;
// };

// export default function Header({
//   practices,
//   data,
//   showSearch = true,
// }: HeaderProps) {
//   const [menuStatus, setMenuStatus] = useState(false);

//   useEffect(() => {
//     console.log("menu status is ", menuStatus);
//   }, [menuStatus]);

//   return (
//     <>
//       <div className="block lg:hidden">
//         <SideBar
//           data={data}
//           practices={practices}
//           menuStatus={menuStatus}
//           setMenuStatus={setMenuStatus}
//         />
//       </div>
//       <div
//         className={`flex ${
//           showSearch ? "justify-between" : "justify-end"
//         } items-center mb-5 mt-4 lg:mt-0`}
//       >
//         <div className={showSearch ? "flex-1" : "hidden"}>
//           <SearchInput />
//         </div>

//         <div className={showSearch ? "hidden" : "flex-1 lg:hidden"}>
//           <div className="text-lg cursor-pointer inline-block relative">
//             MENU
//             <div
//               className="absolute bottom-0 left-0 right-0 h-[1px] bg-current"
//               onClick={() => {
//                 console.log("hey ");
//                 setMenuStatus(true);
//               }}
//               style={{ width: "calc(100% - 0.2rem)" }}
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-7">
//           <div className="relative p-2">
//             <Bell width={40} height={40} className="cursor-pointer" />
//             <p className="bg-red-500 absolute top-0 right-2 px-1 rounded-lg text-white text-xs">
//               2
//             </p>
//           </div>
//           {/* <Image
//           src={ProfilePic}
//           alt="profile-pic"
//           className="rounded-full cursor-pointer"
//           height={60}
//           width={60}
//         /> */}
//           <ProfilePiceDropDown />
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { Bell } from "lucide-react";
import ProfilePiceDropDown from "@/components/ProfilePicDropDown";
import { TDentistPractice } from "@/types/dentist-practice";
import { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import SideBar from "./SideBar";

type HeaderProps = {
  practices: TDentistPractice[];
  data: { text: string; logo: StaticImageData; link: string }[];
  showSearch?: boolean;
};

export default function Header({
  practices,
  data,
  showSearch = true,
}: HeaderProps) {
  const [menuStatus, setMenuStatus] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        menuStatus &&
        !target.closest(".sidebar-container") &&
        !target.closest(".menu-button")
      ) {
        setMenuStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuStatus]);

  return (
    <>
      {/* Sidebar Overlay */}
      {/* {menuStatus && (
        <div className="fixed inset-0  bg-opacity-50 z-40 lg:hidden" />
      )} */}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          menuStatus ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 lg:hidden sidebar-container`}
      >
        <SideBar
          data={data}
          practices={practices}
          menuStatus={menuStatus}
          setMenuStatus={setMenuStatus}
        />
      </div>

      {/* Header Content */}
      <div
        className={`flex ${
          showSearch ? "justify-between" : "justify-end"
        } items-center mb-5 mt-4 lg:mt-0 relative z-30`}
      >
        {/* <div className={showSearch ? "flex-1" : "hidden"}>
          <SearchInput />
        </div> */}

        <div className={showSearch ? "hidden" : "flex-1 lg:hidden"}>
          <div
            className="text-lg cursor-pointer inline-block relative menu-button"
            onClick={() => setMenuStatus(true)}
          >
            MENU
            <div
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-current"
              style={{ width: "calc(100% - 0.2rem)" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-7">
          <div className="relative p-2">
            <Bell width={40} height={40} className="cursor-pointer" />
            <p className="bg-red-500 absolute top-0 right-2 px-1 rounded-lg text-white text-xs">
              2
            </p>
          </div>
          <ProfilePiceDropDown />
        </div>
      </div>
    </>
  );
}
