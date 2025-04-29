"use client";
import {
  useCreateMCQ,
  useDeleteMCQ,
  usePatchMCQ,
} from "@/services/mcq/MCQMutation";
import { useUploadFile } from "@/services/s3/s3Mutation";
import { ExtendedTMCQ, TMCQForm, TMCQProcessed } from "@/types/mcq";
import { toast } from "react-hot-toast";
import QuestionForm from "./QuestionForm";
import { useRouter } from "next/navigation";

type QuestionListProps = {
  data: ExtendedTMCQ[];
  procedureId: string;
  consentName: string | null;
};

export default function QuestionList({
  data,
  procedureId,
  consentName,
}: QuestionListProps) {
  const router = useRouter();

  const { mutateAsync: uploadFile, isPending: isFilePending } = useUploadFile();
  const { mutate: createMCQ, isPending: isCreatePending } = useCreateMCQ();
  const { mutate: patchMCQ, isPending: isPatchPending } = usePatchMCQ();
  const { mutate: deleteMCQ, isPending: isDeletePending } = useDeleteMCQ();

  const handleSubmit = async (
    mcqs: (TMCQForm & {
      dirtyFields?: {
        procedureId?: boolean | undefined;
        questionText?: boolean | undefined;
        correctAnswer?: boolean | undefined;
        options?:
          | {
              label?: boolean | undefined;
              text?: boolean | undefined;
            }[]
          | undefined;
        videoUrl?: boolean | undefined;
        id?: boolean | undefined;
      };
    })[]
  ) => {
    // console.log("mcqs are ", mcqs);
    try {
      // Separate new and existing MCQs
      const newMCQs = mcqs.filter((mcq) => !mcq.id);
      const existingMCQs = mcqs.filter((mcq) => mcq.id);

      // Process new MCQs (create)
      if (newMCQs.length > 0) {
        // console.log("in create mcq");
        const processedNewMCQs: TMCQProcessed[] = await Promise.all(
          newMCQs.map(async (mcq) => {
            let videoUrl = "";
            if (mcq.videoUrl) {
              // console.log("video file is ", mcq.videoUrl);
              await uploadFile({
                selectedFile: mcq.videoUrl,
              });
              videoUrl = `uploads/aspire-consent/${mcq.videoUrl.name}`;
            }

            return {
              questionText: mcq.questionText,
              correctAnswer: mcq.correctAnswer,
              options: mcq.options,
              videoUrl,
              procedureId: mcq.procedureId || (procedureId as string),
            };
          })
        );

        createMCQ(
          { data: processedNewMCQs },
          {
            onSuccess: () => {
              // console.log("data is ", data);
              toast.success("MCQ created successfully");
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      }

      // Process existing MCQs (patch) - only send changed fields
      if (existingMCQs.length > 0) {
        // console.log("in edit mcq");

        await Promise.all(
          existingMCQs.map(async (mcq) => {
            const updateData: Partial<TMCQProcessed> = {};
            const dirtyFields = mcq.dirtyFields || {};

            // Only include fields that were actually changed
            if (dirtyFields.questionText) {
              updateData.questionText = mcq.questionText;
            }

            if (dirtyFields.correctAnswer || dirtyFields.options) {
              updateData.correctAnswer = mcq.correctAnswer;
              // console.log("options are ", dirtyFields.options);
              updateData.options = mcq.options;
            }

            if (dirtyFields.videoUrl && mcq.videoUrl) {
              // console.log("dirty file is ", dirtyFields.videoUrl);
              // console.log("mcq dfile is ", mcq.videoUrl);
              await uploadFile({
                selectedFile: mcq.videoUrl,
              });

              updateData.videoUrl = `uploads/aspire-consent/${mcq.videoUrl.name}`;
            } else if (dirtyFields.videoUrl && !mcq.videoUrl) {
              updateData.videoUrl = "";
            }

            if (Object.keys(updateData).length > 0) {
              return patchMCQ({
                id: mcq.id!,
                data: {
                  ...updateData,
                  procedureId: mcq.procedureId || (procedureId as string),
                },
              });
            }
            return Promise.resolve(); // No changes, skip
          })
        );
      }

      closeForm();
    } catch (error) {
      console.error("Error in MCQ submission:", error);
      toast.error("Failed to save MCQs");
    }
  };
  const handleDelete = async (id: string) => {
    deleteMCQ(
      { id },
      {
        onSuccess: () => {
          // console.log("data is ", data);
          toast.success("MCQ deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const closeForm = () => {
    router.back();
  };

  return (
    <div>
      <QuestionForm
        onSubmit={handleSubmit}
        data={data}
        onDelete={handleDelete}
        isPending={
          isCreatePending || isDeletePending || isFilePending || isPatchPending
        }
        onCancel={closeForm}
        procedureId={procedureId}
        procedureName={consentName}
      />
    </div>
  );
}
