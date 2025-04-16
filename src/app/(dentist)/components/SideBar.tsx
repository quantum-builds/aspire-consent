"use client";

import {
  AspireConsentWhiteLogo,
  ConsentFormIcon,
  SettingIcon,
  DashboardIcon,
  PatientIcon,
  LogoutIcon,
} from "@/asssets";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDE_BAR_DATA = [
  { text: "Dashboard", logo: DashboardIcon, link: "/dashboard" },
  { text: "Consent Forms", logo: ConsentFormIcon, link: "/consent-forms" },
  { text: "Patients", logo: PatientIcon, link: "/patients" },
  { text: "Settings", logo: SettingIcon, link: "/settings" },
];

export default function SideBar() {
  const pathname = usePathname();

  async function handleLogout() {
    await signOut();
  }

  return (
    <div className="bg-[#5353FF] w-full  min-h-screen  px-6 py-8 lg:flex flex-col z-50">
      <div className="mb-10 flex items-center justify-center">
        <Image
          src={AspireConsentWhiteLogo}
          alt="aspire-consent-logo"
          width={190}
          height={120}
          priority
        />
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {SIDE_BAR_DATA.map((content, index) => {
          const isActive = pathname === content.link;
          return (
            <Link
              key={index}
              href={content.link}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-[#698AFF] text-white" : "hover:bg-[#698AFF]"
              }`}
            >
              <Image
                src={content.logo}
                alt={`${content.text}-logo`}
                width={20}
                height={20}
              />
              <span className="text-lg text-white">{content.text}</span>
            </Link>
          );
        })}
      </div>
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-[#698AFF] text-white cursor-pointer"
        onClick={handleLogout}
      >
        <Image src={LogoutIcon} alt="logout-logo" width={20} height={20} />
        <span className="text-lg text-white">Logout</span>
      </div>
    </div>
  );
}
