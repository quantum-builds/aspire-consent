-- DropForeignKey
ALTER TABLE "ConsentFormLink" DROP CONSTRAINT "ConsentFormLink_procedureId_fkey";

-- AddForeignKey
ALTER TABLE "ConsentFormLink" ADD CONSTRAINT "ConsentFormLink_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
