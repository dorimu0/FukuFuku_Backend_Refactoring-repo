/*
  Warnings:

  - Added the required column `key` to the `BoardImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `boardimage` ADD COLUMN `key` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Image` (
    `url` VARCHAR(100) NOT NULL,
    `key` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`url`, `key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
