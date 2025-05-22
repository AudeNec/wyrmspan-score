/*
  Warnings:

  - The primary key for the `score` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `matchId` on the `score` table. All the data in the column will be lost.
  - You are about to drop the `match` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gameId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `Match_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `Match_modeId_fkey`;

-- DropForeignKey
ALTER TABLE `score` DROP FOREIGN KEY `Score_matchId_fkey`;

-- DropIndex
DROP INDEX `Score_matchId_fkey` ON `score`;

-- AlterTable
ALTER TABLE `score` DROP PRIMARY KEY,
    DROP COLUMN `matchId`,
    ADD COLUMN `gameId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`playerId`, `gameId`);

-- DropTable
DROP TABLE `match`;

-- CreateTable
CREATE TABLE `Game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `authorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_modeId_fkey` FOREIGN KEY (`modeId`) REFERENCES `Mode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
