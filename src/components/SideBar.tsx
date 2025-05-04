"use client";

import { AspireConsentWhiteLogo } from "@/asssets";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Building2, MapPin } from "lucide-react";
import PracticeModal from "./PracticeModel";
import type { TDentistPractice } from "@/types/dentist-practice";
import type { TPractice } from "@/types/practices";

type SideBarProps = {
  data: { text: string; logo: StaticImageData; link: string }[];
  practices: TDentistPractice[];
};

export default function SideBar({ data, practices }: SideBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<TPractice | null>(
    null
  );

  useEffect(() => {
    if (!selectedPractice) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("practiceId", selectedPractice.id);

    // Trigger navigation with updated query param
    router.push(`${pathname}?${params.toString()}`);
  }, [selectedPractice]);

  // Initialize selected practice when practices are available
  useEffect(() => {
    if (practices.length > 0 && !selectedPractice)
      setSelectedPractice(practices[0].practice);
  }, [practices, selectedPractice]);

  return (
    <div className="bg-[#5353FF] w-full h-screen px-6 py-8 flex flex-col z-50 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-center">
        <Image
          src={AspireConsentWhiteLogo || "/placeholder.svg"}
          alt="aspire-consent-logo"
          width={190}
          height={120}
          priority
        />
      </div>

      {/* Practice Selector */}
      <div className="mb-6">
        <div className="text-white text-sm mb-2 opacity-80">
          Current Practice
        </div>
        <div
          className="bg-[#4747E5] rounded-lg p-3 cursor-pointer transition-all hover:bg-[#4040D0]"
          onClick={() => {
            if (practices.length > 0) setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          {selectedPractice ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-white opacity-80" />
                  <span className="text-white font-medium">
                    {selectedPractice.name}
                  </span>
                </div>
                {isDropdownOpen ? (
                  <ChevronUp className="h-5 w-5 text-white" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="mt-1 text-xs text-white opacity-70 flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>{selectedPractice.address}</span>
              </div>
            </>
          ) : (
            <div
              className="flex items-center justify-between "
              onClick={() => {
                console.log("hey there");
                setIsModalOpen(true);
                // setIsDropdownOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-white opacity-80" />
                <span className="text-white font-medium">
                  Add your first practice
                </span>
              </div>
              {/* {isDropdownOpen ? (
                <ChevronUp className="h-5 w-5 text-white" />
              ) : (
                <ChevronDown className="h-5 w-5 text-white" />
              )} */}
            </div>
            // <>dwedwe</>
          )}
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="mt-2 bg-[#4747E5] rounded-lg overflow-hidden shadow-lg border border-[#6969FF] animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Add Practice Option */}
            <div
              className="p-3 border-b border-[#6969FF] flex items-center gap-2 cursor-pointer hover:bg-[#4040D0] transition-colors"
              onClick={() => {
                setIsModalOpen(true);
                setIsDropdownOpen(false);
              }}
            >
              <div className="h-8 w-8 rounded-full bg-[#698AFF] flex items-center justify-center flex-shrink-0">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <span className="text-white">
                {/* {practices.length === 0
                  ? "Add your first practice"
                  : "Add a practice"} */}
                Add a practice
              </span>
            </div>

            {/* Practice List */}
            {practices.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {practices.map((practice) => (
                  <div
                    key={practice.practiceId}
                    className={`p-3 flex items-center gap-2 cursor-pointer hover:bg-[#4040D0] transition-colors ${
                      selectedPractice &&
                      selectedPractice.id === practice.practiceId
                        ? "bg-[#3A3AD9]"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedPractice(practice.practice);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="h-8 w-8 rounded-full bg-[#698AFF] flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">
                        {practice.practice.name}
                      </div>
                      <div className="text-xs text-white opacity-70 truncate">
                        {practice.practice.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-white text-sm opacity-80">
                No practices available yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-4 mb-4">
        {data.map((content, index) => {
          const isActive =
            pathname === content.link || pathname.startsWith(`${content.link}`);
          return (
            <Link
              key={index}
              href={content.link + `?practiceId=${selectedPractice?.id}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-[#698AFF] text-white" : "hover:bg-[#698AFF]"
              }`}
            >
              <Image
                src={content.logo || "/placeholder.svg"}
                alt={`${content.text}-logo`}
                width={20}
                height={20}
              />
              <span className="text-lg text-white">{content.text}</span>
            </Link>
          );
        })}
      </div>

      {/* Add Practice Modal */}
      <PracticeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
