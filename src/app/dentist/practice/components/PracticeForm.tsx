"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TPractice } from "@/types/practices";
import toast from "react-hot-toast";
import { useCreateDentistPractice } from "@/services/dentistPractice/DentistPracticeMutation";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const formSchema = z.object({
  // image: z
  //   .instanceof(File)
  //   .refine(
  //     (file) =>
  //       !file ||
  //       ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(
  //         file.type
  //       ),
  //     "Invalid file type. Supported types: png, jpg, jpeg, svg"
  //   ),
  selectedPractices: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
      })
    )
    .min(1, "Please select at least one practice"),
});

type FormValues = z.infer<typeof formSchema>;
type PracticeFormProps = {
  practices: TPractice[];
  errorMessage: string | null;
};
export default function PracticeForm({
  practices,
  errorMessage,
}: PracticeFormProps) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [commandOpen, setCommandOpen] = useState(false);
  const { mutate: createDentistPractice } = useCreateDentistPractice();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedPractices: [],
    },
  });

  const selectedPractices = form.watch("selectedPractices") || [];

  const addPractice = (practice: TPractice) => {
    const currentPractices = form.getValues("selectedPractices") || [];
    if (!currentPractices.some((p) => p.id === practice.id)) {
      form.setValue("selectedPractices", [...currentPractices, practice]);
    }
    setCommandOpen(false);
  };

  const removePractice = (practiceId: string) => {
    const currentPractices = form.getValues("selectedPractices") || [];
    form.setValue(
      "selectedPractices",
      currentPractices.filter((p) => p.id !== practiceId)
    );
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const dirtyFields = form.formState.dirtyFields;
    let updatePractices: TPractice[] = [];
    if (dirtyFields.selectedPractices) updatePractices = data.selectedPractices;

    await Promise.all(
      updatePractices.map(async (practice: TPractice) => {
        if (practice) {
          createDentistPractice({
            practiceId: practice.id,
            dentistEmail: email,
          });
        }
      })
    );
    setIsLoading(false);
    toast.success("Dentist and practice linked successfully");
    router.replace("/login");
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, { id: "fetch-practice-error" });
    }
  }, [errorMessage]);

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-xl font-semibold mb-6 text-[#698AFF]">
          Hey {email}!
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* <FormField
            control={form.control}
            name="profileImage"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      {...fieldProps}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("profileImage")?.click()
                      }
                      className="w-full"
                    >
                      {profileImagePreview
                        ? "Change Picture"
                        : "Upload Picture"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} */}
          {/* <div className="space-y-2">
                  <Label htmlFor="itemImage">Member Image</Label>
                  <div className="flex gap-4 items-center">
                    <div className="grid w-full gap-1.5 items-center max-w-sm">
                      <Label htmlFor="itemImage" className="sr-only">
                        Member Image
                      </Label>
                      <Controller
                        name={`image`}
                        control={form.control}
                        render={({ field }) => (
                          <FileUploader
                            onFileUpload={(files) => {
                              field.onChange(files ? files[0] : null);
                            }}
                            allowedTypes={[
                              "image/png",
                              "image/jpeg",
                              "image/jpg",
                              "image/svg+xml",
                            ]}
                            showPreview={true}
                            icon="ri-upload-cloud-2-line"
                            maxFiles={1}
                            text="Upload Member Image"
                            extraText="Drag and drop an image or click to browse"
                            disabled={isSubmitting}
                            error={form.formState.errors.image?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div> */}

          <FormField
            control={form.control}
            name="selectedPractices"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>Add your practices</FormLabel>
                <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={commandOpen}
                      className="justify-between"
                    >
                      Select your practices
                      <span className="ml-2 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
                        {selectedPractices.length}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search practices..." />
                      <CommandList>
                        <CommandEmpty>No practices found.</CommandEmpty>
                        <CommandGroup>
                          {practices.map((practice) => (
                            <CommandItem
                              key={practice.id}
                              value={practice.name}
                              onSelect={() => addPractice(practice)}
                              className={cn(
                                "flex flex-col items-start",
                                selectedPractices.some(
                                  (p) => p.id === practice.id
                                ) && "bg-accent"
                              )}
                            >
                              <span className="font-medium">
                                {practice.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {practice.address}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedPractices.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Selected Practices:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPractices.map((practice) => (
                  <Badge
                    key={practice.id}
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 pl-3"
                  >
                    {practice.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => removePractice(practice.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {selectedPractices.map((practice) => (
                  <div key={practice.id} className="mt-1">
                    <span className="font-medium">{practice.name}</span>:{" "}
                    {practice.address}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#698AFF] hover:bg-[#698AFF]  text-white cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
