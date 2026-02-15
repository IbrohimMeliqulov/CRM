/*
  Warnings:

  - You are about to drop the column `hire_date` on the `staffs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `staffs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `staffs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `staffs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "hire_date",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "staffs_phone_key" ON "staffs"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_email_key" ON "staffs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_phone_key" ON "students"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
