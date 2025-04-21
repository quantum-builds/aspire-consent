-- DropForeignKey
ALTER TABLE "ConsentFormLink" DROP CONSTRAINT "ConsentFormLink_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "ConsentFormLink" DROP CONSTRAINT "ConsentFormLink_patientId_fkey";

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
