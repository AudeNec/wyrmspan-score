/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Mode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pseudo]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Mode_title_key` ON `Mode`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `Player_pseudo_key` ON `Player`(`pseudo`);
