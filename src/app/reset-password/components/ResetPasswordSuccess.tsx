import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PasswordResetSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-medium text-[#7C5DFA]">
            Successful password reset!
          </h1>

          <p className="text-gray-600 text-sm">
            You can use your new password to log in to your account!
          </p>

          <div className="pt-4">
            <Link href="/login">
              <Button className="w-full bg-[#7C5DFA] hover:bg-[#6A4DF4] text-white">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
