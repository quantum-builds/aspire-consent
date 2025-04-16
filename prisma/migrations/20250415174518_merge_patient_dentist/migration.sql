/*
  Warnings:

  - The values [admin,staff] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `personalizedQuestion` on the `ConsentPackMCQ` table. All the data in the column will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('dentist', 'patient');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentPack" DROP CONSTRAINT "ConsentPack_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_patientId_fkey";

-- AlterTable
ALTER TABLE "ConsentPackMCQ" DROP COLUMN "personalizedQuestion";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT;

-- DropTable
DROP TABLE "Patient";

-- AddForeignKey
ALTER TABLE "ConsentPack" ADD CONSTRAINT "ConsentPack_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
