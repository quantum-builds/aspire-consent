"use client";
import { ProfilePic } from "@/asssets";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export default function ProfilePiceDropDown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await signOut();
    setLogoutDialogOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Image
        src={ProfilePic}
        alt="profile-pic"
        className="rounded-full cursor-pointer"
        height={60}
        width={60}
        onClick={() => setShowDropdown((prev) => !prev)}
      />

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
          <div
            className="hover:bg-gray-100 rounded-xl px-4 py-2 text-lg text-black w-full flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LogOut size={20} />
            <span className=" ">Logout</span>
          </div>
        </div>
      )}

      {/* <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-[#698AFF] text-white cursor-pointer"
        onClick={() => setLogoutDialogOpen(true)}
      >
        <Image src={LogoutIcon} alt="logout-logo" width={20} height={20} />
        <span className="text-lg text-white">Logout</span>
      </div> */}

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of the admin panel?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-[#698AFF] hover:bg-[#698AFF]  text-white cursor-pointer"
            >
              {/* <Image
                src={LogoutIcon}
                alt="logout-logo"
                width={20}
                height={20}
              /> */}
              <LogOut size={20} />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
