/*
  Warnings:

  - You are about to drop the column `patientEmail` on the `ConsentFormLink` table. All the data in the column will be lost.
  - Added the required column `patientId` to the `ConsentFormLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConsentFormLink" DROP CONSTRAINT "ConsentFormLink_patientEmail_fkey";

-- AlterTable
ALTER TABLE "ConsentFormLink" DROP COLUMN "patientEmail",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
