/*
  Warnings:

  - Added the required column `authorName` to the `Music` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Music` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Music` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Music` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Music` ADD COLUMN `authorName` VARCHAR(191) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NOT NULL,
    ADD COLUMN `timestamp` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `videoId` VARCHAR(191) NOT NULL;
