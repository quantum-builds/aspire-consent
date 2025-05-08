/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `MCQ` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `MCQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `MCQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Procedure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MCQ" DROP COLUMN "videoUrl",
ADD COLUMN     "endTime" INTEGER NOT NULL,
ADD COLUMN     "startTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Procedure" ADD COLUMN     "videoUrl" TEXT NOT NULL;
