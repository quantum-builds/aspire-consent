/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Procedure` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Procedure_name_key" ON "Procedure"("name");
