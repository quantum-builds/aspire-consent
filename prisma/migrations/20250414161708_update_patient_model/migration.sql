/*
  Warnings:

  - You are about to drop the column `temporaryToken` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiry` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Patient_temporaryToken_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "temporaryToken",
DROP COLUMN "tokenExpiry";

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
