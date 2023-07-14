/*
  Warnings:

  - You are about to drop the column `userId` on the `Board` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Board` DROP FOREIGN KEY `Board_userId_fkey`;

-- AlterTable
ALTER TABLE `Board` DROP COLUMN `userId`;
