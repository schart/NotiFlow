/*
  Warnings:

  - Added the required column `subject` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "subject" VARCHAR(70) NOT NULL,
ALTER COLUMN "text" SET DATA TYPE VARCHAR(500);

-- DropEnum
DROP TYPE "NotificationEnum";
