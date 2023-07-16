/*
  Warnings:

  - You are about to drop the column `reply` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `replyer` on the `Reply` table. All the data in the column will be lost.
  - Added the required column `commenter` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Board` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Reply` DROP COLUMN `reply`,
    DROP COLUMN `replyer`,
    ADD COLUMN `commenter` VARCHAR(10) NOT NULL,
    ADD COLUMN `content` VARCHAR(100) NOT NULL;
