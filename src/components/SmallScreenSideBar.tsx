"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { StaticImageData } from "next/image";
import SideBar from "./SideBar";
import { TDentistPractice } from "@/types/dentist-practice";

interface SideBarProps {
  data: { text: string; logo: StaticImageData; link: string }[];
  practices: TDentistPractice[];
}

export default function SmallScreenSideBar({ data, practices }: SideBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${
        isOpen ? "bg-[#5353FF]" : "bg-transparent"
      } w-10/12 md:w-4/12`}
    >
      {/* Mobile Header with Menu Button */}
      <div
        className={`flex items-center p-4 ${
          isOpen ? "bg-transparent" : "bg-white"
        }`}
      >
        {isOpen ? (
          <X
            className="cursor-pointer text-white"
            width={30}
            height={30}
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <Menu
            className="cursor-pointer"
            width={30}
            height={30}
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>

      {/* Mobile Sidebar (absolute positioned) */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-10/12 md:w-4/12  bg-transparent z-50 shadow-xl -mt-2">
          <SideBar data={data} practices={practices} />
        </div>
      )}
    </div>
  );
}
