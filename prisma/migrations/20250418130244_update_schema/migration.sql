/*
  Warnings:

  - You are about to drop the column `dynamicField` on the `MCQ` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConsentPack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConsentPackMCQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `videoUrl` to the `MCQ` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_consentPackMCQId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentPack" DROP CONSTRAINT "ConsentPack_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentPack" DROP CONSTRAINT "ConsentPack_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentPack" DROP CONSTRAINT "ConsentPack_practiceId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentPack" DROP CONSTRAINT "ConsentPack_procedureId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentPackMCQ" DROP CONSTRAINT "ConsentPackMCQ_consentPackId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentPackMCQ" DROP CONSTRAINT "ConsentPackMCQ_mcqId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_consentPackId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_procedureId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- AlterTable
ALTER TABLE "MCQ" DROP COLUMN "dynamicField",
ADD COLUMN     "options" TEXT[],
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "ConsentPack";

-- DropTable
DROP TABLE "ConsentPackMCQ";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Video";

-- CreateTable
CREATE TABLE "DentistToProcedure" (
    "dentistId" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,

    CONSTRAINT "DentistToProcedure_pkey" PRIMARY KEY ("dentistId","procedureId")
);

-- CreateTable
CREATE TABLE "ConsentFormLink" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "dentistId" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "status" "ConsentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ConsentFormLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentAnswer" (
    "id" TEXT NOT NULL,
    "consentFormLinkId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCQAnswer" (
    "id" TEXT NOT NULL,
    "consentAnswerId" TEXT NOT NULL,
    "mcqId" TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "MCQAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConsentFormLink_token_key" ON "ConsentFormLink"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentAnswer_consentFormLinkId_key" ON "ConsentAnswer"("consentFormLinkId");

-- AddForeignKey
ALTER TABLE "DentistToProcedure" ADD CONSTRAINT "DentistToProcedure_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentistToProcedure" ADD CONSTRAINT "DentistToProcedure_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_patientEmail_fkey" FOREIGN KEY ("patientEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAnswer" ADD CONSTRAINT "ConsentAnswer_consentFormLinkId_fkey" FOREIGN KEY ("consentFormLinkId") REFERENCES "ConsentFormLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAnswer" ADD CONSTRAINT "ConsentAnswer_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQAnswer" ADD CONSTRAINT "MCQAnswer_consentAnswerId_fkey" FOREIGN KEY ("consentAnswerId") REFERENCES "ConsentAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQAnswer" ADD CONSTRAINT "MCQAnswer_mcqId_fkey" FOREIGN KEY ("mcqId") REFERENCES "MCQ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
