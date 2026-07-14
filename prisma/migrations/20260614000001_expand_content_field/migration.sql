-- AlterTable: Expand content field from VARCHAR(191) to LONGTEXT
ALTER TABLE `ArticleTranslation` MODIFY COLUMN `content` LONGTEXT NOT NULL;