-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(40) NOT NULL,
    `picture` VARCHAR(100) NOT NULL,
    `firstName` VARCHAR(10) NOT NULL,
    `lastName` VARCHAR(15) NOT NULL,
    `isAdmin` INTEGER NULL,
    `refreshToken` VARCHAR(250) NULL,
    `nickName` VARCHAR(10) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_refreshToken_key`(`refreshToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Userimage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `u_id` INTEGER NOT NULL,
    `url` VARCHAR(50) NULL,

    UNIQUE INDEX `Userimage_u_id_key`(`u_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `u_id` INTEGER NOT NULL,
    `title` VARCHAR(20) NOT NULL,
    `content` TEXT NOT NULL,
    `like` INTEGER NULL DEFAULT 0,
    `views` INTEGER NULL DEFAULT 0,
    `writeDate` DATE NOT NULL,

    UNIQUE INDEX `Post_id_key`(`id`),
    PRIMARY KEY (`id`, `u_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Postimage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `p_id` INTEGER NOT NULL,
    `url` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `p_id` INTEGER NOT NULL,
    `commenter` VARCHAR(10) NOT NULL,
    `comment` VARCHAR(100) NOT NULL,
    `like` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `Comment_id_key`(`id`),
    PRIMARY KEY (`id`, `p_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `c_id` INTEGER NOT NULL,
    `replyer` VARCHAR(10) NOT NULL,
    `reply` VARCHAR(100) NOT NULL,
    `like` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `Reply_id_key`(`id`),
    PRIMARY KEY (`id`, `c_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Userimage` ADD CONSTRAINT `Userimage_u_id_fkey` FOREIGN KEY (`u_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_u_id_fkey` FOREIGN KEY (`u_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Postimage` ADD CONSTRAINT `Postimage_p_id_fkey` FOREIGN KEY (`p_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_p_id_fkey` FOREIGN KEY (`p_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD CONSTRAINT `Reply_c_id_fkey` FOREIGN KEY (`c_id`) REFERENCES `Comment`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
