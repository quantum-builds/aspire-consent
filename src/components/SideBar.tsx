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
  // const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // async function handleLogout() {
  //   await signOut();
  //   setLogoutDialogOpen(false);
  // }

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
        {data.map((content, index) => {
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
      {/* <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-[#698AFF] text-white cursor-pointer"
        onClick={() => setLogoutDialogOpen(true)}
      >
        <Image src={LogoutIcon} alt="logout-logo" width={20} height={20} />
        <span className="text-lg text-white">Logout</span>
      </div>

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
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-[#698AFF] hover:bg-[#698AFF]  text-white"
            >
              <Image
                src={LogoutIcon}
                alt="logout-logo"
                width={20}
                height={20}
              />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
