/*
  Warnings:

  - Added the required column `photo` to the `staffs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staffs" ADD COLUMN     "photo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "photo" TEXT NOT NULL;
