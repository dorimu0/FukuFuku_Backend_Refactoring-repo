/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `p_id` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Comment` DROP PRIMARY KEY,
    DROP COLUMN `p_id`,
    ADD PRIMARY KEY (`id`);
