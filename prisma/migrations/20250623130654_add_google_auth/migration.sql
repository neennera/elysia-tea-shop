-- AlterTable
ALTER TABLE `User` ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL DEFAULT 'password';
