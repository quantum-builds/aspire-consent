/*
  Warnings:

  - Made the column `address` on table `Practice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Practice" ALTER COLUMN "address" SET NOT NULL;
