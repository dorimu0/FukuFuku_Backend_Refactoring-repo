/*
  Warnings:

  - The primary key for the `Board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `u_id` on the `Board` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Board` DROP FOREIGN KEY `Board_u_id_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_p_id_fkey`;

-- DropForeignKey
ALTER TABLE `Postimage` DROP FOREIGN KEY `Postimage_p_id_fkey`;

-- AlterTable
ALTER TABLE `Board` DROP PRIMARY KEY,
    DROP COLUMN `u_id`;
