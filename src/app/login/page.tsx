import { Suspense } from "react";
import { LoginSkeleton } from "@/app/login/components/LoginSkeleton";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
