/*
  Warnings:

  - The primary key for the `board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `boardId` on the `board_tag` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `refreshToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `postimage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userimage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `b_id` to the `Board_Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `board` DROP FOREIGN KEY `Board_u_id_fkey`;

-- DropForeignKey
ALTER TABLE `board_tag` DROP FOREIGN KEY `Board_Tag_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `userimage` DROP FOREIGN KEY `Userimage_u_id_fkey`;

-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- DropIndex
DROP INDEX `User_refreshToken_key` ON `user`;

-- AlterTable
ALTER TABLE `board` DROP PRIMARY KEY;

-- AlterTable
ALTER TABLE `board_tag` DROP COLUMN `boardId`,
    ADD COLUMN `b_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `like` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `refreshToken`,
    ADD COLUMN `introduction` VARCHAR(50) NULL,
    ADD PRIMARY KEY (`id`, `email`);

-- DropTable
DROP TABLE `postimage`;

-- DropTable
DROP TABLE `userimage`;

-- CreateTable
CREATE TABLE `Like` (
    `b_id` INTEGER NOT NULL,
    `u_id` INTEGER NOT NULL,

    PRIMARY KEY (`b_id`, `u_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoardImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `b_id` INTEGER NOT NULL,
    `url` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `BoardImage_id_key`(`id`),
    UNIQUE INDEX `BoardImage_url_key`(`url`),
    PRIMARY KEY (`id`, `b_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_u_id_fkey` FOREIGN KEY (`u_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Board_Tag` ADD CONSTRAINT `Board_Tag_b_id_fkey` FOREIGN KEY (`b_id`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_b_id_fkey` FOREIGN KEY (`b_id`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_u_id_fkey` FOREIGN KEY (`u_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardImage` ADD CONSTRAINT `BoardImage_b_id_fkey` FOREIGN KEY (`b_id`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
