/*
  Warnings:

  - You are about to drop the column `practiceId` on the `ConsentFormLink` table. All the data in the column will be lost.
  - You are about to drop the column `practiceId` on the `Procedure` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConsentFormLink" DROP CONSTRAINT "ConsentFormLink_practiceId_fkey";

-- DropForeignKey
ALTER TABLE "Procedure" DROP CONSTRAINT "Procedure_practiceId_fkey";

-- AlterTable
ALTER TABLE "ConsentFormLink" DROP COLUMN "practiceId";

-- AlterTable
ALTER TABLE "Procedure" DROP COLUMN "practiceId";
