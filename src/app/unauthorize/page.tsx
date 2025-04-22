"use client";

import { useSession } from "next-auth/react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const token = session?.user;
  const dashboardLink =
    token?.role === "dentist" ? "/dentist/dashboard" : "/patient/dashboard";

  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-[#698AFF]/20 blur-lg"></div>
            <div className="relative bg-[#698AFF] text-white p-6 rounded-full">
              <ShieldAlert size={64} />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access this page. Please contact
          your administrator if you believe this is an error.
        </p>

        <div className="flex justify-center ">
          <Button
            onClick={() => {
              console.log("hdwehduwdhuwehduwhdwhe");
              router.replace(dashboardLink);
            }}
            className="inline-flex items-center gap-2 bg-[#698AFF] hover:bg-[#5470E0] text-white font-medium py-5 px-6 rounded-lg transition-all shadow-lg shadow-[#698AFF]/30 hover:shadow-xl hover:shadow-[#698AFF]/40"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#698AFF"
            fillOpacity="0.1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
