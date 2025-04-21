-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_consentFormLinkId_fkey";

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_consentFormLinkId_fkey" FOREIGN KEY ("consentFormLinkId") REFERENCES "ConsentFormLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
