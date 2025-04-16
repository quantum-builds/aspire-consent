import SearchInput from "@/app/(dentist)/components/SearchInput";
import { ProfilePic } from "@/asssets";
import { Bell } from "lucide-react";
import Image from "next/image";

type HeaderProps = { showSearch?: boolean };

export default function Header({ showSearch = true }: HeaderProps) {
  return (
    <div
      className={`flex ${
        showSearch ? "justify-between" : "justify-end"
      } items-center mb-5`}
    >
      <div className={showSearch ? "w-full" : "hidden"}>
        <SearchInput />
      </div>

      <div className="flex items-center gap-7">
        <div className="relative p-2">
          <Bell width={30} height={30} className="cursor-pointer" />
          <p className="bg-red-500 absolute top-0 right-2 px-1 rounded-lg text-white text-xs">
            2
          </p>
        </div>
        <Image
          src={ProfilePic}
          alt="profile-pic"
          className="rounded-full cursor-pointer"
          height={80}
          width={80}
        />
      </div>
    </div>
  );
}
