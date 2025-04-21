-- AlterTable
ALTER TABLE "ConsentFormLink" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "FormAnswer" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true;
