/*
  Warnings:

  - You are about to drop the column `endTime` on the `MCQ` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `MCQ` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Procedure` table. All the data in the column will be lost.
  - Added the required column `videoUrl` to the `MCQ` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MCQ" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Procedure" DROP COLUMN "videoUrl";
