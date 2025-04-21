/*
  Warnings:

  - You are about to drop the `ConsentAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MCQAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConsentAnswer" DROP CONSTRAINT "ConsentAnswer_consentFormLinkId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentAnswer" DROP CONSTRAINT "ConsentAnswer_patientId_fkey";

-- DropForeignKey
ALTER TABLE "MCQAnswer" DROP CONSTRAINT "MCQAnswer_consentAnswerId_fkey";

-- DropForeignKey
ALTER TABLE "MCQAnswer" DROP CONSTRAINT "MCQAnswer_mcqId_fkey";

-- AlterTable
ALTER TABLE "ConsentFormLink" ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MCQ" ADD COLUMN     "consentFormLinkId" TEXT;

-- DropTable
DROP TABLE "ConsentAnswer";

-- DropTable
DROP TABLE "MCQAnswer";

-- CreateTable
CREATE TABLE "FormAnswer" (
    "id" TEXT NOT NULL,
    "consentFormLinkId" TEXT NOT NULL,
    "mcqId" TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionText" TEXT NOT NULL,
    "questionOptions" TEXT[],

    CONSTRAINT "FormAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MCQ" ADD CONSTRAINT "MCQ_consentFormLinkId_fkey" FOREIGN KEY ("consentFormLinkId") REFERENCES "ConsentFormLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_consentFormLinkId_fkey" FOREIGN KEY ("consentFormLinkId") REFERENCES "ConsentFormLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_mcqId_fkey" FOREIGN KEY ("mcqId") REFERENCES "MCQ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
