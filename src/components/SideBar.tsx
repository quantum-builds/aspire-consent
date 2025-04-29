"use client";

import { AspireConsentWhiteLogo } from "@/asssets";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SideBarProps = {
  data: { text: string; logo: StaticImageData; link: string }[];
};

export default function SideBar({ data }: SideBarProps) {
  const pathname = usePathname();

  return (
    <div className="bg-[#5353FF] w-full min-h-screen px-6 py-8 lg:flex flex-col z-50 ">
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
        {data.map((content, index) => {
          // Check if current path exactly matches or starts with the link
          const isActive =
            pathname === content.link ||
            pathname.startsWith(`${content.link}/`);
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
    </div>
  );
}
