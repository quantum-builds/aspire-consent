"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCreatePractice } from "@/services/practice/PracticeMutation";

// Define the form schema with Zod
const practiceFormSchema = z.object({
  name: z.string().min(1, "Practice name is required"),
  address: z.string().min(1, "Practice address is required"),
});

// Infer the type from the schema
type PracticeFormValues = z.infer<typeof practiceFormSchema>;

type PracticeModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PracticeModal({
  isModalOpen,
  setIsModalOpen,
}: PracticeModalProps) {
  const router = useRouter();
  const { mutate: createPractice, isPending } = useCreatePractice();

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // Reset form when modal opens/closes
  // useEffect(() => {
  //   if (isModalOpen) {
  //     form.reset({
  //       name: newPractice.name,
  //       address: newPractice.address,
  //     });
  //   }
  // }, [isModalOpen, form, newPractice]);

  // Handle form submission
  const onSubmit = async (data: PracticeFormValues) => {
    createPractice(
      { data },
      {
        onSuccess: () => {
          // console.log("data is ", data);
          setTimeout(() => {
            router.refresh();
          }, 100);
          toast.success("Practice created successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
    setIsModalOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Practice
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the required information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">
                    Practice Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter practice name"
                      {...field}
                      className="border-gray-300 focus:border-[#698AFF] focus:ring-[#698AFF]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter practice address"
                      className="min-h-[80px] border-gray-300 focus:border-[#698AFF] focus:ring-[#698AFF]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#698AFF" }}
                className="hover:bg-[#5470e6] text-white"
                disabled={isPending || form.formState.isSubmitting}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Practice"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
