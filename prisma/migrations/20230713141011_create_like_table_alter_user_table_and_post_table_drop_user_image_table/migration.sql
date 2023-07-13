/*
  Warnings:

  - You are about to drop the column `like` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `userimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userimage` DROP FOREIGN KEY `Userimage_u_id_fkey`;

-- DropIndex
DROP INDEX `User_refreshToken_key` ON `user`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `like`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `refreshToken`;

-- DropTable
DROP TABLE `userimage`;

-- CreateTable
CREATE TABLE `Like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `p_id` INTEGER NOT NULL,
    `u_id` INTEGER NOT NULL,

    UNIQUE INDEX `Like_id_key`(`id`),
    PRIMARY KEY (`id`, `p_id`, `u_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_p_id_fkey` FOREIGN KEY (`p_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_u_id_fkey` FOREIGN KEY (`u_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
