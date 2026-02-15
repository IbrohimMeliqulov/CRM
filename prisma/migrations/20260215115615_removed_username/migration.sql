/*
  Warnings:

  - You are about to drop the column `created_at` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `students` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `staffs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `staffs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "created_at",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
