import SearchInput from "@/components/SearchInput";
import { Bell } from "lucide-react";
import ProfilePiceDropDown from "@/components/ProfilePicDropDown";

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
          <Bell width={40} height={40} className="cursor-pointer" />
          <p className="bg-red-500 absolute top-0 right-2 px-1 rounded-lg text-white text-xs">
            2
          </p>
        </div>
        {/* <Image
          src={ProfilePic}
          alt="profile-pic"
          className="rounded-full cursor-pointer"
          height={60}
          width={60}
        /> */}
        <ProfilePiceDropDown />
      </div>
    </div>
  );
}
