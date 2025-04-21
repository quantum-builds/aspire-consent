/*
  Warnings:

  - You are about to drop the column `mcqId` on the `FormAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `consentFormLinkId` on the `MCQ` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_mcqId_fkey";

-- DropForeignKey
ALTER TABLE "MCQ" DROP CONSTRAINT "MCQ_consentFormLinkId_fkey";

-- AlterTable
ALTER TABLE "FormAnswer" DROP COLUMN "mcqId",
ADD COLUMN     "mcqSnapshotId" TEXT,
ADD COLUMN     "originalMCQId" TEXT;

-- AlterTable
ALTER TABLE "MCQ" DROP COLUMN "consentFormLinkId";

-- CreateTable
CREATE TABLE "ConsentFormMCQSnapshot" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "options" TEXT[],
    "videoUrl" TEXT NOT NULL,
    "consentFormLinkId" TEXT NOT NULL,

    CONSTRAINT "ConsentFormMCQSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsentFormMCQSnapshot" ADD CONSTRAINT "ConsentFormMCQSnapshot_consentFormLinkId_fkey" FOREIGN KEY ("consentFormLinkId") REFERENCES "ConsentFormLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_mcqSnapshotId_fkey" FOREIGN KEY ("mcqSnapshotId") REFERENCES "ConsentFormMCQSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_originalMCQId_fkey" FOREIGN KEY ("originalMCQId") REFERENCES "MCQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;
