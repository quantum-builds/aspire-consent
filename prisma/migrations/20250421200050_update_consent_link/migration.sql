-- DropForeignKey
ALTER TABLE "ConsentFormMCQSnapshot" DROP CONSTRAINT "ConsentFormMCQSnapshot_consentFormLinkId_fkey";

-- AddForeignKey
ALTER TABLE "ConsentFormMCQSnapshot" ADD CONSTRAINT "ConsentFormMCQSnapshot_consentFormLinkId_fkey" FOREIGN KEY ("consentFormLinkId") REFERENCES "ConsentFormLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
