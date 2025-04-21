-- DropForeignKey
ALTER TABLE "DentistToPractice" DROP CONSTRAINT "DentistToPractice_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "DentistToPractice" DROP CONSTRAINT "DentistToPractice_practiceId_fkey";

-- DropForeignKey
ALTER TABLE "DentistToProcedure" DROP CONSTRAINT "DentistToProcedure_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "DentistToProcedure" DROP CONSTRAINT "DentistToProcedure_procedureId_fkey";

-- AddForeignKey
ALTER TABLE "DentistToPractice" ADD CONSTRAINT "DentistToPractice_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentistToPractice" ADD CONSTRAINT "DentistToPractice_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentistToProcedure" ADD CONSTRAINT "DentistToProcedure_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentistToProcedure" ADD CONSTRAINT "DentistToProcedure_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
