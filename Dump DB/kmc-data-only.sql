-- KMC Data Only (no schema)
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `Article` (`id`, `groupId`, `subgroupId`, `status`, `authorId`, `createdAt`, `updatedAt`) VALUES (29, 17, 21, 'PUBLIC', 1, '2026-06-12 09:44:59', '2026-06-12 11:39:25');
INSERT INTO `Article` (`id`, `groupId`, `subgroupId`, `status`, `authorId`, `createdAt`, `updatedAt`) VALUES (30, 17, 21, 'PUBLIC', 1, '2026-06-12 15:00:42', '2026-06-12 15:46:50');

INSERT INTO `ArticleCollection` (`id`, `userId`, `articleId`, `createdAt`) VALUES (6, 2, 29, '2026-06-12 10:36:10');

INSERT INTO `ArticleFeedback` (`id`, `articleId`, `helpful`, `ip`, `createdAt`, `updatedAt`) VALUES (2, 29, 1, '::ffff:127.0.0.1', '2026-06-12 10:07:18', '2026-06-12 10:07:18');

INSERT INTO `ArticleTranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (57, 29, 'en', 'Artikel A-A-1', '<p><strong>Artikel A-A-1</strong></p><img src="/uploads/1781264334660-mt6jg5.png"><p></p><p>Ok</p>');
INSERT INTO `ArticleTranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (58, 29, 'id', 'Artikel A-A-1', '<p><strong>Artikel A-A-1</strong></p><img src="/uploads/1781264357471-xlmr3n.png"><p></p><p>OK</p>');
INSERT INTO `ArticleTranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (59, 30, 'en', 'Welcome to Knowledge Management Center', 'Welcome! This platform helps you find information.');
INSERT INTO `ArticleTranslation` (`id`, `articleId`, `locale`, `title`, `content`) VALUES (60, 30, 'id', 'Selamat Datang di Pusat Manajemen Pengetahuan', 'Selamat datang! Platform ini membantu Anda menemukan informasi.');

INSERT INTO `Exam` (`id`, `name`, `createdAt`, `updatedAt`) VALUES (1, 'Ujian Tahap 1', '2026-06-13 07:36:59', '2026-06-13 07:37:32');

INSERT INTO `ExamAnswer` (`id`, `assignmentId`, `questionId`, `selectedOptionIndex`, `isCorrect`, `createdAt`) VALUES (1, 1, 1, 2, 1, '2026-06-13 07:55:48');
INSERT INTO `ExamAnswer` (`id`, `assignmentId`, `questionId`, `selectedOptionIndex`, `isCorrect`, `createdAt`) VALUES (2, 1, 2, 1, 0, '2026-06-13 07:55:48');
INSERT INTO `ExamAnswer` (`id`, `assignmentId`, `questionId`, `selectedOptionIndex`, `isCorrect`, `createdAt`) VALUES (3, 1, 3, 2, 1, '2026-06-13 07:55:48');

INSERT INTO `ExamAssignment` (`id`, `examId`, `userId`, `status`, `score`, `startedAt`, `submittedAt`, `createdAt`, `updatedAt`) VALUES (1, 1, 2, 'COMPLETED', 67, NULL, '2026-06-13 07:55:48', '2026-06-13 07:54:18', '2026-06-13 07:55:48');

INSERT INTO `ExamQuestion` (`id`, `examId`, `questionId`) VALUES (1, 1, 1);
INSERT INTO `ExamQuestion` (`id`, `examId`, `questionId`) VALUES (2, 1, 2);
INSERT INTO `ExamQuestion` (`id`, `examId`, `questionId`) VALUES (3, 1, 3);

INSERT INTO `Group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (17, 1, '2026-06-12 09:39:24', '2026-06-12 09:39:24', 'PUBLIC');
INSERT INTO `Group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (18, 2, '2026-06-12 09:39:44', '2026-06-12 09:39:44', 'PUBLIC');
INSERT INTO `Group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (19, 3, '2026-06-12 09:39:59', '2026-06-12 09:39:59', 'PUBLIC');
INSERT INTO `Group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (20, 4, '2026-06-12 09:40:14', '2026-06-12 09:40:14', 'INTERNAL');
INSERT INTO `Group` (`id`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (21, 5, '2026-06-12 09:40:41', '2026-06-12 09:40:41', 'PUBLIC');

INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (34, 17, 'en', 'Grup A');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (35, 17, 'id', 'Grup A');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (36, 18, 'en', 'Grup B');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (37, 18, 'id', 'Grup B');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (38, 19, 'en', 'Grup C');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (39, 19, 'id', 'Grup C');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (40, 20, 'en', 'Grup D');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (41, 20, 'id', 'Grup D');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (42, 21, 'en', 'Grup E');
INSERT INTO `GroupTranslation` (`id`, `groupId`, `locale`, `name`) VALUES (43, 21, 'id', 'Grup E');

INSERT INTO `Question` (`id`, `questionGroupId`, `content`, `imageUrl`, `order`, `correctOptionIndex`, `createdAt`, `updatedAt`) VALUES (1, 1, '<p>DOmpet dhuafa berdisi pada tahun berapa ?</p>', NULL, 0, 2, '2026-06-12 15:39:37', '2026-06-12 15:39:37');
INSERT INTO `Question` (`id`, `questionGroupId`, `content`, `imageUrl`, `order`, `correctOptionIndex`, `createdAt`, `updatedAt`) VALUES (2, 1, '<p>Nama yang bukan sebagai pendiri dompet dhuafa adalah?</p>', NULL, 0, 3, '2026-06-12 15:40:45', '2026-06-12 15:40:45');
INSERT INTO `Question` (`id`, `questionGroupId`, `content`, `imageUrl`, `order`, `correctOptionIndex`, `createdAt`, `updatedAt`) VALUES (3, 1, '<p>Dompet Dhuafa lahir dari media apa ?</p>', NULL, 0, 2, '2026-06-12 15:42:11', '2026-06-12 15:42:11');

INSERT INTO `QuestionGroup` (`id`, `order`, `status`, `createdAt`, `updatedAt`) VALUES (1, 1, 'INTERNAL', '2026-06-12 12:15:17', '2026-06-12 12:15:17');

INSERT INTO `QuestionGroupTranslation` (`id`, `questionGroupId`, `locale`, `name`) VALUES (1, 1, 'en', 'History DD');
INSERT INTO `QuestionGroupTranslation` (`id`, `questionGroupId`, `locale`, `name`) VALUES (2, 1, 'id', 'Sejarah DD');

INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (1, 1, 0, '1992');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (2, 1, 1, '1993');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (3, 1, 2, '1994');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (4, 1, 3, '1995');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (5, 2, 0, 'Parni Hadi');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (6, 2, 1, 'Haidar Bagir');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (7, 2, 2, 'Sutiono S Ecip');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (8, 2, 3, 'Jamil Azzaini');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (9, 3, 0, 'Kompas');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (10, 3, 1, 'Harian terbit');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (11, 3, 2, 'Republika');
INSERT INTO `QuestionOption` (`id`, `questionId`, `index`, `content`) VALUES (12, 3, 3, 'Tempo');

INSERT INTO `Setting` (`key`, `value`) VALUES ('hero_bg_color_end', '#0ca76e');
INSERT INTO `Setting` (`key`, `value`) VALUES ('hero_bg_color_start', '#0d771f');
INSERT INTO `Setting` (`key`, `value`) VALUES ('hero_bg_image', '');
INSERT INTO `Setting` (`key`, `value`) VALUES ('hero_subtitle_en', 'Find answers and information quickly and easily');
INSERT INTO `Setting` (`key`, `value`) VALUES ('hero_subtitle_id', 'Temukan jawaban dan informasi dengan cepat dan mudah');
INSERT INTO `Setting` (`key`, `value`) VALUES ('hero_title_en', 'Information Center');
INSERT INTO `Setting` (`key`, `value`) VALUES ('hero_title_id', 'Pusat Informasi');
INSERT INTO `Setting` (`key`, `value`) VALUES ('hover_category_color', '#eebe11');
INSERT INTO `Setting` (`key`, `value`) VALUES ('site_logo', '/uploads/1781278377011.JPG');
INSERT INTO `Setting` (`key`, `value`) VALUES ('site_title', 'Pusat Informasi');

INSERT INTO `SubGroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (21, 17, 1, '2026-06-12 09:41:19', '2026-06-12 09:41:19', 'PUBLIC');
INSERT INTO `SubGroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (22, 17, 2, '2026-06-12 09:41:35', '2026-06-12 09:41:35', 'PUBLIC');
INSERT INTO `SubGroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (23, 18, 3, '2026-06-12 09:41:56', '2026-06-12 09:41:56', 'PUBLIC');
INSERT INTO `SubGroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (24, 18, 4, '2026-06-12 09:42:13', '2026-06-12 09:42:13', 'PUBLIC');
INSERT INTO `SubGroup` (`id`, `groupId`, `order`, `createdAt`, `updatedAt`, `status`) VALUES (25, 20, 1, '2026-06-12 09:42:44', '2026-06-12 09:42:44', 'INTERNAL');

INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (41, 21, 'en', 'Sub Grup A-1');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (42, 21, 'id', 'Sub Grup A-1');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (43, 22, 'en', 'Sub Grup A-2');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (44, 22, 'id', 'Sub Grup A-2');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (45, 23, 'en', 'Sub Grup B-1');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (46, 23, 'id', 'Sub Grup B-1');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (47, 24, 'en', 'Sub Grup B-2');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (48, 24, 'id', 'Sub Grup B-2');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (49, 25, 'en', 'Sub Grup D-1');
INSERT INTO `SubGroupTranslation` (`id`, `subgroupId`, `locale`, `name`) VALUES (50, 25, 'id', 'Sub Grup D-1');

INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (1, 'admin@kmc.com', '$2b$10$vSwlzGv1eD6adWx6sTXWRuD2JRkYKZ1vrcRlCGFF6hRFHOYfQH2TK', 'Admin KMC', 'ADMIN', '2026-06-11 09:19:42', '2026-06-11 09:19:42');
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (2, 'internal@kmc.com', '$2b$10$jNUbEYx/kM55TV0BRZodFurAwmdpd58u1qaeGrb0xxjPKgVxktG7u', 'Internal User', 'INTERNAL', '2026-06-11 09:19:42', '2026-06-11 09:19:42');
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (3, 'Fajar@dompetdhuafa.org', '$2b$10$23p7.Cx6cFp8NnQfQ6N/ZOpI5loYvSe6AASwj.NWzjGRcUoX2/Saa', 'Fajar', 'HR', '2026-06-11 15:19:01', '2026-06-11 15:19:01');
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES (4, 'hr@kmc.com', '$2b$10$31shw737HzyTy4Wl3toE9.M5.9lAbKBPkdgotCdmA4R8TNoxSQooe', 'HR User', 'HR', '2026-06-12 15:00:42', '2026-06-12 15:00:42');

SET FOREIGN_KEY_CHECKS = 1;
