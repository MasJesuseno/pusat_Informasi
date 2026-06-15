-- KMC Database Dump
-- Generated: 2026-06-13T15:27:09.246Z

DROP DATABASE IF EXISTS kmc;
CREATE DATABASE kmc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kmc;
SET FOREIGN_KEY_CHECKS = 0;


--
-- Table: _prisma_migrations
--
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('0e398ac7-18bd-441d-a53e-19b8be7825e3', '43ab545229a65645995fe89a63b6d82a44155674e6b591db8e467598e0dcf5a6', '2026-06-11 08:50:31', '20260611085030_init', NULL, NULL, '2026-06-11 08:50:30', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('172fe3a9-2d3c-45ff-9df5-145c9a7f9923', '10bcd186cacf21b05625d01d0ecd706d9871d36d37905dbbccb96e6ed3368128', '2026-06-11 10:16:10', '20260611101610_add_settings', NULL, NULL, '2026-06-11 10:16:10', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('2e388a57-44d8-444b-956b-56f26ca0859a', '9d4cbf51f10b26a66effef8f63b5da117c5f2815e15f8c635ac059e615a0a6a7', '2026-06-11 14:30:58', '20260611143042_add_article_feedback', NULL, NULL, '2026-06-11 14:30:58', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('40752ab6-aa4e-4639-b954-f41dc33d747b', 'c2a25c5f346cd62ea943cee45325ad36aa6d9d6fd828da4f2a05fe610617b241', '2026-06-13 07:41:16', '20260613074116_add_exam_assignments', NULL, NULL, '2026-06-13 07:41:16', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('611608ff-b714-4e32-a872-24bf573f6064', '6d2c364f9ba2f23e75ca1ebd02703055111bb0a1524079ebd3fee21e17f137e6', '2026-06-12 09:16:21', '20260612091621_add_status_groups_subgroups', NULL, NULL, '2026-06-12 09:16:21', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('723452c7-0087-4d34-9ace-2e33e7f7405c', 'abc40451e34049bbe0aaded3db643a1d12dc316a33ccd8071e2d9fc86e93950f', '2026-06-12 11:52:01', '20260612115201_add_question_models', NULL, NULL, '2026-06-12 11:52:01', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('cf2517cf-624c-4a27-b128-f46fe29179bd', '1c6cced576e9abcb12b4d1d137a1d32234c0389039ca1f643bb51a69b71a83a1', '2026-06-12 10:11:23', '20260612101123_add_article_collection', NULL, NULL, '2026-06-12 10:11:23', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('d1315716-4dc9-4c0a-838d-68b78556b615', '5108a05029f33d1f3599a159c63214f1907647e0a25c380167a22227d792b7ee', '2026-06-13 07:17:51', '20260613071751_add_exams', NULL, NULL, '2026-06-13 07:17:51', 1);


--
-- Table: article
--
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `subgroupId` int DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLIC',
  `authorId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Article_groupId_fkey` (`groupId`),
  KEY `Article_subgroupId_fkey` (`subgroupId`),
  KEY `Article_authorId_fkey` (`authorId`),
  CONSTRAINT `Article_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Article_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Article_subgroupId_fkey` FOREIGN KEY (`subgroupId`) REFERENCES `subgroup` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `article` (`id`, `groupId`, `subgroupId`, `status`, `authorId`, `createdAt`, `updatedAt`) VALUES (29, 17, 21, 'PUBLIC', 1, '2026-06-12 09:44:59', '2026-06-12 11:39:25');
INSERT INTO `article` (`id`, `groupId`, `subgroupId`, `status`, `authorId`, `createdAt`, `updatedAt`) VALUES (30, 17, 21, 'PUBLIC', 1, '2026-06-12 15:00:42', '2026-06-12 15:46:50');


--
-- Table: articlecollection
--
CREATE TABLE `articlecollection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `articleId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ArticleCollection_userId_articleId_key` (`userId`,`articleId`),
  KEY `ArticleCollection_articleId_fkey` (`articleId`),
  CONSTRAINT `ArticleCollection_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ArticleCollection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `articlecollection` (`id`, `userId`, `articleId`, `createdAt`) VALUES (6, 2, 29, '2026-06-12 10:36:10');


--
-- Table: articlefeedback
--
CREATE TABLE `articlefeedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `articleId` int NOT NULL,
  `helpful` tinyint(1) NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ArticleFeedback_articleId_ip_key` (`articleId`,`ip`),
  CONSTRAINT `ArticleFeedback_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `articlefeedback` (`id`, `articleId`, `helpful`, `ip`, `createdAt`, `updatedAt`) VALUES (2, 29, 1, '::ffff:127.0.0.1', '2026-06-12 10:07:18', '2026-06-12 10:07:18');


--
-- Table: articletranslation
--
CREATE TABLE `articletranslation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `articleId` int NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ArticleTranslation_articleId_locale_key` (`articleId`,`locale`),
  CONSTRAINT `ArticleTranslation_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `articletranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (57, 29, 'en', 'Artikel A-A-1', '<p><strong>Artikel A-A-1</strong></p><img src="/uploads/1781264334660-mt6jg5.png"><p></p><p>Ok</p>');
INSERT INTO `articletranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (58, 29, 'id', 'Artikel A-A-1', '<p><strong>Artikel A-A-1</strong></p><img src="/uploads/1781264357471-xlmr3n.png"><p></p><p>OK</p>');
INSERT INTO `articletranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (59, 30, 'en', 'Welcome to Knowledge Management Center', 'Welcome! This platform helps you find information.');
INSERT INTO `articletranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (60, 30, 'id', 'Selamat Datang di Pusat Manajemen Pengetahuan', 'Selamat datang! Platform ini membantu Anda menemukan informasi.');


--
-- Table: exam
--
CREATE TABLE `exam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `exam` (`id`, `name`, `createdAt`, `updatedAt`) VALUES (1, 'Ujian Tahap 1', '2026-06-13 07:36:59', '2026-06-13 07:37:32');


--
-- Table: examanswer
--
CREATE TABLE `examanswer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assignmentId` int NOT NULL,
  `questionId` int NOT NULL,
  `selectedOptionIndex` int DEFAULT NULL,
  `isCorrect` tinyint(1) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ExamAnswer_assignmentId_fkey` (`assignmentId`),
  KEY `ExamAnswer_questionId_fkey` (`questionId`),
  CONSTRAINT `ExamAnswer_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `examassignment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ExamAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `examanswer` (`id`, `assignmentId`, `questionId`, `selectedOptionIndex`, `isCorrect`, `createdAt`) VALUES (1, 1, 1, 2, 1, '2026-06-13 07:55:48');
INSERT INTO `examanswer` (`id`, `assignmentId`, `questionId`, `selectedOptionIndex`, `isCorrect`, `createdAt`) VALUES (2, 1, 2, 1, 0, '2026-06-13 07:55:48');
INSERT INTO `examanswer` (`id`, `assignmentId`, `questionId`, `selectedOptionIndex`, `isCorrect`, `createdAt`) VALUES (3, 1, 3, 2, 1, '2026-06-13 07:55:48');


--
-- Table: examassignment
--
CREATE TABLE `examassignment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `examId` int NOT NULL,
  `userId` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `score` int DEFAULT NULL,
  `startedAt` datetime(3) DEFAULT NULL,
  `submittedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ExamAssignment_examId_userId_key` (`examId`,`userId`),
  KEY `ExamAssignment_userId_fkey` (`userId`),
  CONSTRAINT `ExamAssignment_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ExamAssignment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `examassignment` (`id`, `examId`, `userId`, `status`, `score`, `startedAt`, `submittedAt`, `createdAt`, `updatedAt`) VALUES (1, 1, 2, 'COMPLETED', 67, NULL, '2026-06-13 07:55:48', '2026-06-13 07:54:18', '2026-06-13 07:55:48');


--
-- Table: examquestion
--
CREATE TABLE `examquestion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `examId` int NOT NULL,
  `questionId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ExamQuestion_examId_questionId_key` (`examId`,`questionId`),
  KEY `ExamQuestion_questionId_fkey` (`questionId`),
  CONSTRAINT `ExamQuestion_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ExamQuestion_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `examquestion` (`id`, `examId`, `questionId`) VALUES (1, 1, 1);
INSERT INTO `examquestion` (`id`, `examId`, `questionId`) VALUES (2, 1, 2);
INSERT INTO `examquestion` (`id`, `examId`, `questionId`) VALUES (3, 1, 3);


--
-- Table: group
--
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLIC',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (17, 1, '2026-06-12 09:39:24', '2026-06-12 09:39:24', 'PUBLIC');
INSERT INTO `group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (18, 2, '2026-06-12 09:39:44', '2026-06-12 09:39:44', 'PUBLIC');
INSERT INTO `group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (19, 3, '2026-06-12 09:39:59', '2026-06-12 09:39:59', 'PUBLIC');
INSERT INTO `group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (20, 4, '2026-06-12 09:40:14', '2026-06-12 09:40:14', 'INTERNAL');
INSERT INTO `group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (21, 5, '2026-06-12 09:40:41', '2026-06-12 09:40:41', 'PUBLIC');


--
-- Table: grouptranslation
--
CREATE TABLE `grouptranslation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `GroupTranslation_groupId_locale_key` (`groupId`,`locale`),
  CONSTRAINT `GroupTranslation_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (34, 17, 'en', 'Grup A');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (35, 17, 'id', 'Grup A');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (36, 18, 'en', 'Grup B');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (37, 18, 'id', 'Grup B');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (38, 19, 'en', 'Grup C');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (39, 19, 'id', 'Grup C');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (40, 20, 'en', 'Grup D');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (41, 20, 'id', 'Grup D');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (42, 21, 'en', 'Grup E');
INSERT INTO `grouptranslation` (`id`, `groupId`, `locale`, `name`) VALUES (43, 21, 'id', 'Grup E');


--
-- Table: question
--
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionGroupId` int NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `correctOptionIndex` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Question_questionGroupId_fkey` (`questionGroupId`),
  CONSTRAINT `Question_questionGroupId_fkey` FOREIGN KEY (`questionGroupId`) REFERENCES `questiongroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `question` (`id`, `questionGroupId`, `content`, `imageUrl`, `order`, `correctOptionIndex`, `createdAt`, `updatedAt`) VALUES (1, 1, '<p>DOmpet dhuafa berdisi pada tahun berapa ?</p>', NULL, 0, 2, '2026-06-12 15:39:37', '2026-06-12 15:39:37');
INSERT INTO `question` (`id`, `questionGroupId`, `content`, `imageUrl`, `order`, `correctOptionIndex`, `createdAt`, `updatedAt`) VALUES (2, 1, '<p>Nama yang bukan sebagai pendiri dompet dhuafa adalah?</p>', NULL, 0, 3, '2026-06-12 15:40:45', '2026-06-12 15:40:45');
INSERT INTO `question` (`id`, `questionGroupId`, `content`, `imageUrl`, `order`, `correctOptionIndex`, `createdAt`, `updatedAt`) VALUES (3, 1, '<p>Dompet Dhuafa lahir dari media apa ?</p>', NULL, 0, 2, '2026-06-12 15:42:11', '2026-06-12 15:42:11');


--
-- Table: questiongroup
--
CREATE TABLE `questiongroup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order` int NOT NULL DEFAULT '0',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLIC',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `questiongroup` (`id`, `order`, `status`, `createdAt`, `updatedAt`) VALUES (1, 1, 'INTERNAL', '2026-06-12 12:15:17', '2026-06-12 12:15:17');


--
-- Table: questiongrouptranslation
--
CREATE TABLE `questiongrouptranslation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionGroupId` int NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `QuestionGroupTranslation_questionGroupId_locale_key` (`questionGroupId`,`locale`),
  CONSTRAINT `QuestionGroupTranslation_questionGroupId_fkey` FOREIGN KEY (`questionGroupId`) REFERENCES `questiongroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `questiongrouptranslation` (`id`, `questionGroupId`, `locale`, `name`) VALUES (1, 1, 'en', 'History DD');
INSERT INTO `questiongrouptranslation` (`id`, `questionGroupId`, `locale`, `name`) VALUES (2, 1, 'id', 'Sejarah DD');


--
-- Table: questionoption
--
CREATE TABLE `questionoption` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionId` int NOT NULL,
  `index` int NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `QuestionOption_questionId_index_key` (`questionId`,`index`),
  CONSTRAINT `QuestionOption_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (1, 1, 0, '1992');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (2, 1, 1, '1993');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (3, 1, 2, '1994');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (4, 1, 3, '1995');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (5, 2, 0, 'Parni Hadi');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (6, 2, 1, 'Haidar Bagir');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (7, 2, 2, 'Sutiono S Ecip');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (8, 2, 3, 'Jamil Azzaini');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (9, 3, 0, 'Kompas');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (10, 3, 1, 'Harian terbit');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (11, 3, 2, 'Republika');
INSERT INTO `questionoption` (`id`, `questionId`, `index`, `content`) VALUES (12, 3, 3, 'Tempo');


--
-- Table: setting
--
CREATE TABLE `setting` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `setting` (`key`, `value`) VALUES ('hero_bg_color_end', '#0ca76e');
INSERT INTO `setting` (`key`, `value`) VALUES ('hero_bg_color_start', '#0d771f');
INSERT INTO `setting` (`key`, `value`) VALUES ('hero_bg_image', '');
INSERT INTO `setting` (`key`, `value`) VALUES ('hero_subtitle_en', 'Find answers and information quickly and easily');
INSERT INTO `setting` (`key`, `value`) VALUES ('hero_subtitle_id', 'Temukan jawaban dan informasi dengan cepat dan mudah');
INSERT INTO `setting` (`key`, `value`) VALUES ('hero_title_en', 'Information Center');
INSERT INTO `setting` (`key`, `value`) VALUES ('hero_title_id', 'Pusat Informasi');
INSERT INTO `setting` (`key`, `value`) VALUES ('hover_category_color', '#eebe11');
INSERT INTO `setting` (`key`, `value`) VALUES ('site_logo', '/uploads/1781278377011.JPG');
INSERT INTO `setting` (`key`, `value`) VALUES ('site_title', 'Pusat Informasi');


--
-- Table: subgroup
--
CREATE TABLE `subgroup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLIC',
  PRIMARY KEY (`id`),
  KEY `SubGroup_groupId_fkey` (`groupId`),
  CONSTRAINT `SubGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `subgroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (21, 17, 1, '2026-06-12 09:41:19', '2026-06-12 09:41:19', 'PUBLIC');
INSERT INTO `subgroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (22, 17, 2, '2026-06-12 09:41:35', '2026-06-12 09:41:35', 'PUBLIC');
INSERT INTO `subgroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (23, 18, 3, '2026-06-12 09:41:56', '2026-06-12 09:41:56', 'PUBLIC');
INSERT INTO `subgroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (24, 18, 4, '2026-06-12 09:42:13', '2026-06-12 09:42:13', 'PUBLIC');
INSERT INTO `subgroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (25, 20, 1, '2026-06-12 09:42:44', '2026-06-12 09:42:44', 'INTERNAL');


--
-- Table: subgrouptranslation
--
CREATE TABLE `subgrouptranslation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subgroupId` int NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SubGroupTranslation_subgroupId_locale_key` (`subgroupId`,`locale`),
  CONSTRAINT `SubGroupTranslation_subgroupId_fkey` FOREIGN KEY (`subgroupId`) REFERENCES `subgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (41, 21, 'en', 'Sub Grup A-1');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (42, 21, 'id', 'Sub Grup A-1');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (43, 22, 'en', 'Sub Grup A-2');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (44, 22, 'id', 'Sub Grup A-2');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (45, 23, 'en', 'Sub Grup B-1');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (46, 23, 'id', 'Sub Grup B-1');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (47, 24, 'en', 'Sub Grup B-2');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (48, 24, 'id', 'Sub Grup B-2');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (49, 25, 'en', 'Sub Grup D-1');
INSERT INTO `subgrouptranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (50, 25, 'id', 'Sub Grup D-1');


--
-- Table: user
--
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INTERNAL',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (1, 'admin@kmc.com', '$2b$10$vSwlzGv1eD6adWx6sTXWRuD2JRkYKZ1vrcRlCGFF6hRFHOYfQH2TK', 'Admin KMC', 'ADMIN', '2026-06-11 09:19:42', '2026-06-11 09:19:42');
INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (2, 'internal@kmc.com', '$2b$10$jNUbEYx/kM55TV0BRZodFurAwmdpd58u1qaeGrb0xxjPKgVxktG7u', 'Internal User', 'INTERNAL', '2026-06-11 09:19:42', '2026-06-11 09:19:42');
INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (3, 'Fajar@dompetdhuafa.org', '$2b$10$23p7.Cx6cFp8NnQfQ6N/ZOpI5loYvSe6AASwj.NWzjGRcUoX2/Saa', 'Fajar', 'HR', '2026-06-11 15:19:01', '2026-06-11 15:19:01');
INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (4, 'hr@kmc.com', '$2b$10$31shw737HzyTy4Wl3toE9.M5.9lAbKBPkdgotCdmA4R8TNoxSQooe', 'HR User', 'HR', '2026-06-12 15:00:42', '2026-06-12 15:00:42');

SET FOREIGN_KEY_CHECKS = 1;
