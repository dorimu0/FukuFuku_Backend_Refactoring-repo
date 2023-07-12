/*
  Warnings:

  - You are about to drop the column `writeDate` on the `Board` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Comment_p_id_fkey` ON `Comment`;

-- DropIndex
DROP INDEX `Postimage_p_id_fkey` ON `Postimage`;

-- AlterTable
ALTER TABLE `Board` DROP COLUMN `writeDate`;
