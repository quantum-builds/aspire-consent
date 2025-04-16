/*
  Warnings:

  - You are about to drop the `_DentistPractices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DentistPractices" DROP CONSTRAINT "_DentistPractices_A_fkey";

-- DropForeignKey
ALTER TABLE "_DentistPractices" DROP CONSTRAINT "_DentistPractices_B_fkey";

-- DropTable
DROP TABLE "_DentistPractices";

-- CreateTable
CREATE TABLE "DentistToPractice" (
    "dentistId" TEXT NOT NULL,
    "practiceId" TEXT NOT NULL,

    CONSTRAINT "DentistToPractice_pkey" PRIMARY KEY ("practiceId","dentistId")
);

-- AddForeignKey
ALTER TABLE "DentistToPractice" ADD CONSTRAINT "DentistToPractice_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentistToPractice" ADD CONSTRAINT "DentistToPractice_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
