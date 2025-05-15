"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useCreateProcedure } from "@/services/procedure/ProcedureMutation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ModalFormProps {
  practiceId: string;
}
export default function ModalForm({ practiceId }: ModalFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createProcedure } = useCreateProcedure();
  const router = useRouter();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Handle form submission
  function onSubmit(data: FormValues) {
    console.log("practice id at submission is ", practiceId);
    createProcedure(
      { data, practiceId },
      {
        onSuccess: () => {
          // console.log("data is ", data);
          setTimeout(() => {
            router.refresh();
          }, 100);
          toast.success("Procedure created successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
    setOpen(false);
    form.reset();
  }

  return (
    <div className="flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            style={{ backgroundColor: "#698AFF" }}
            className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-[26px] text-xl px-2 flex items-center justify-center rounded-md"
          >
            <Plus width={20} height={20} className="mr-1" />
            New Procedure
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Enter Information
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
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter description (optional)"
                        className="border-gray-300 focus-within:border-[#698AFF] focus-within:ring-[#698AFF]"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-sm">
                      This field is optional
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  style={{ backgroundColor: "#698AFF" }}
                  className="hover:bg-[#5470e6] text-white"
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
