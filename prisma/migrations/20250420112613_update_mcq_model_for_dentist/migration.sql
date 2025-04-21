/*
  Warnings:

  - A unique constraint covering the columns `[procedureId,dentistId,id]` on the table `MCQ` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dentistId` to the `MCQ` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MCQ" ADD COLUMN     "dentistId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MCQ_procedureId_dentistId_id_key" ON "MCQ"("procedureId", "dentistId", "id");

-- AddForeignKey
ALTER TABLE "MCQ" ADD CONSTRAINT "MCQ_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
