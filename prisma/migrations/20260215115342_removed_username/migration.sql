/*
  Warnings:

  - You are about to drop the column `username` on the `staffs` table. All the data in the column will be lost.
  - Made the column `phone` on table `staffs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "staffs_username_key";

-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "username",
ALTER COLUMN "phone" SET NOT NULL;
