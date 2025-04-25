"use client";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConsentTitle() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <MoveLeft
        size={20}
        className="cursor-pointer"
        onClick={() => router.back()}
      />
      <p className="text-2xl font-bold mb-2">View Questions</p>
    </div>
  );
}
