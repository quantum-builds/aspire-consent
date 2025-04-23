-- DropForeignKey
ALTER TABLE "MCQ" DROP CONSTRAINT "MCQ_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "MCQ" DROP CONSTRAINT "MCQ_procedureId_fkey";

-- AddForeignKey
ALTER TABLE "MCQ" ADD CONSTRAINT "MCQ_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQ" ADD CONSTRAINT "MCQ_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
