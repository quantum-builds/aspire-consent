/*
  Warnings:

  - Added the required column `practiceId` to the `ConsentFormLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practiceId` to the `Procedure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConsentFormLink" ADD COLUMN     "practiceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Procedure" ADD COLUMN     "practiceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
