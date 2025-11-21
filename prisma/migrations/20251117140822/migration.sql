/*
  Warnings:

  - You are about to alter the column `destination` on the `notification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `text` on the `notification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - Made the column `messageId` on table `notification` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NotificationEnum" AS ENUM ('EMAIL', 'SMS');

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "destination" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "text" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "messageId" SET NOT NULL;
