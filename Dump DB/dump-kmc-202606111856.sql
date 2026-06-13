-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: kmc
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0e398ac7-18bd-441d-a53e-19b8be7825e3','43ab545229a65645995fe89a63b6d82a44155674e6b591db8e467598e0dcf5a6','2026-06-11 08:50:31.127','20260611085030_init',NULL,NULL,'2026-06-11 08:50:30.869',1),('172fe3a9-2d3c-45ff-9df5-145c9a7f9923','10bcd186cacf21b05625d01d0ecd706d9871d36d37905dbbccb96e6ed3368128','2026-06-11 10:16:10.925','20260611101610_add_settings',NULL,NULL,'2026-06-11 10:16:10.912',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (1,1,1,'PUBLIC',1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(2,1,1,'PUBLIC',1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(3,1,2,'PUBLIC',1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(4,2,3,'PUBLIC',1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(5,3,4,'INTERNAL',1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(6,4,5,'PUBLIC',1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(7,4,5,'DRAFT',1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(8,5,6,'PUBLIC',1,'2026-06-11 09:26:14.130','2026-06-11 09:26:14.130'),(9,5,6,'PUBLIC',1,'2026-06-11 09:26:14.134','2026-06-11 09:26:14.134'),(10,5,7,'PUBLIC',1,'2026-06-11 09:26:14.139','2026-06-11 09:26:14.139'),(11,6,8,'PUBLIC',1,'2026-06-11 09:26:14.143','2026-06-11 09:26:14.143'),(12,7,9,'INTERNAL',1,'2026-06-11 09:26:14.148','2026-06-11 09:26:14.148'),(13,8,10,'PUBLIC',1,'2026-06-11 09:26:14.152','2026-06-11 09:26:14.152'),(14,8,10,'DRAFT',1,'2026-06-11 09:26:14.155','2026-06-11 09:26:14.155'),(15,9,11,'PUBLIC',1,'2026-06-11 10:24:16.743','2026-06-11 10:24:16.743'),(16,9,11,'PUBLIC',1,'2026-06-11 10:24:16.751','2026-06-11 10:24:16.751'),(17,9,12,'PUBLIC',1,'2026-06-11 10:24:16.758','2026-06-11 10:24:16.758'),(18,10,13,'PUBLIC',1,'2026-06-11 10:24:16.766','2026-06-11 10:24:16.766'),(19,11,14,'INTERNAL',1,'2026-06-11 10:24:16.773','2026-06-11 10:24:16.773'),(20,12,15,'PUBLIC',1,'2026-06-11 10:24:16.782','2026-06-11 10:24:16.782'),(21,12,15,'DRAFT',1,'2026-06-11 10:24:16.790','2026-06-11 10:24:16.790');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articletranslation`
--

DROP TABLE IF EXISTS `articletranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articletranslation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `articleId` int NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ArticleTranslation_articleId_locale_key` (`articleId`,`locale`),
  CONSTRAINT `ArticleTranslation_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articletranslation`
--

LOCK TABLES `articletranslation` WRITE;
/*!40000 ALTER TABLE `articletranslation` DISABLE KEYS */;
INSERT INTO `articletranslation` VALUES (1,1,'en','Welcome to Knowledge Management Center','<p>Welcome! This platform helps you find information quickly and easily.</p>'),(2,1,'id','Selamat Datang di Pusat Manajemen Pengetahuan','<p>Selamat datang! Platform ini membantu Anda menemukan informasi.</p>'),(3,2,'en','How to Search for Articles','<p>Use the search bar at the top to find articles.</p>'),(4,2,'id','Cara Mencari Artikel','<p>Gunakan bilah pencarian di bagian atas untuk mencari artikel.</p>'),(5,3,'en','Creating Your Account','<p>Click Login and follow the instructions to create your account.</p>'),(6,3,'id','Membuat Akun Anda','<p>Klik Masuk dan ikuti petunjuk untuk membuat akun Anda.</p>'),(7,4,'en','Available Subscription Plans','<p>We offer Basic, Pro, and Enterprise plans.</p>'),(8,4,'id','Paket Langganan Tersedia','<p>Kami menawarkan paket Dasar, Pro, dan Enterprise.</p>'),(9,5,'en','Internal Workflow Guidelines','<p>Internal guidelines for team members.</p>'),(10,5,'id','Panduan Alur Kerja Internal','<p>Panduan internal untuk anggota tim.</p>'),(11,6,'en','Troubleshooting Login Issues','<p>Steps to resolve login problems.</p>'),(12,6,'id','Pemecahan Masalah Login','<p>Langkah-langkah mengatasi masalah login.</p>'),(13,7,'en','Upcoming Feature: Dark Mode','<p>Dark mode feature coming soon!</p>'),(14,7,'id','Fitur Mendatang: Mode Gelap','<p>Fitur mode gelap akan segera hadir!</p>'),(15,8,'en','Welcome to Knowledge Management Center','Welcome! This platform helps you find information.'),(16,8,'id','Selamat Datang di Pusat Manajemen Pengetahuan','Selamat datang! Platform ini membantu Anda menemukan informasi.'),(17,9,'en','How to Search for Articles','Use the search bar at the top to find articles.'),(18,9,'id','Cara Mencari Artikel','Gunakan bilah pencarian di bagian atas untuk mencari artikel.'),(19,10,'en','Creating Your Account','Click Login and select Create Account.'),(20,10,'id','Membuat Akun Anda','Klik Masuk dan pilih Buat Akun.'),(21,11,'en','Available Subscription Plans','We offer Basic, Pro, and Enterprise plans.'),(22,11,'id','Paket Langganan Tersedia','Kami menawarkan paket Dasar, Pro, dan Enterprise.'),(23,12,'en','Internal Workflow Guidelines','Internal guidelines for team members.'),(24,12,'id','Panduan Alur Kerja Internal','Panduan internal untuk anggota tim.'),(25,13,'en','Troubleshooting Login Issues','Steps to resolve login problems.'),(26,13,'id','Pemecahan Masalah Login','Langkah-langkah mengatasi masalah login.'),(27,14,'en','Upcoming Feature: Dark Mode','Dark mode feature coming soon!'),(28,14,'id','Fitur Mendatang: Mode Gelap','Fitur mode gelap akan segera hadir!'),(29,15,'en','Welcome to Knowledge Management Center','Welcome! This platform helps you find information.'),(30,15,'id','Selamat Datang di Pusat Manajemen Pengetahuan','Selamat datang! Platform ini membantu Anda menemukan informasi.'),(31,16,'en','How to Search for Articles','Use the search bar at the top to find articles.'),(32,16,'id','Cara Mencari Artikel','Gunakan bilah pencarian di bagian atas untuk mencari artikel.'),(33,17,'en','Creating Your Account','Click Login and select Create Account.'),(34,17,'id','Membuat Akun Anda','Klik Masuk dan pilih Buat Akun.'),(35,18,'en','Available Subscription Plans','We offer Basic, Pro, and Enterprise plans.'),(36,18,'id','Paket Langganan Tersedia','Kami menawarkan paket Dasar, Pro, dan Enterprise.'),(37,19,'en','Internal Workflow Guidelines','Internal guidelines for team members.'),(38,19,'id','Panduan Alur Kerja Internal','Panduan internal untuk anggota tim.'),(39,20,'en','Troubleshooting Login Issues','Steps to resolve login problems.'),(40,20,'id','Pemecahan Masalah Login','Langkah-langkah mengatasi masalah login.'),(41,21,'en','Upcoming Feature: Dark Mode','Dark mode feature coming soon!'),(42,21,'id','Fitur Mendatang: Mode Gelap','Fitur mode gelap akan segera hadir!');
/*!40000 ALTER TABLE `articletranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (1,1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(2,2,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(3,3,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(4,4,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(5,1,'2026-06-11 09:26:14.078','2026-06-11 09:26:14.078'),(6,2,'2026-06-11 09:26:14.083','2026-06-11 09:26:14.083'),(7,3,'2026-06-11 09:26:14.088','2026-06-11 09:26:14.088'),(8,4,'2026-06-11 09:26:14.093','2026-06-11 09:26:14.093'),(9,1,'2026-06-11 10:24:16.661','2026-06-11 10:24:16.661'),(10,2,'2026-06-11 10:24:16.671','2026-06-11 10:24:16.671'),(11,3,'2026-06-11 10:24:16.679','2026-06-11 10:24:16.679'),(12,4,'2026-06-11 10:24:16.688','2026-06-11 10:24:16.688');
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grouptranslation`
--

DROP TABLE IF EXISTS `grouptranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grouptranslation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `GroupTranslation_groupId_locale_key` (`groupId`,`locale`),
  CONSTRAINT `GroupTranslation_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grouptranslation`
--

LOCK TABLES `grouptranslation` WRITE;
/*!40000 ALTER TABLE `grouptranslation` DISABLE KEYS */;
INSERT INTO `grouptranslation` VALUES (1,1,'en','Getting Started'),(2,1,'id','Memulai'),(3,2,'en','Account and Billing'),(4,2,'id','Akun dan Tagihan'),(5,3,'en','Features and Guides'),(6,3,'id','Fitur dan Panduan'),(7,4,'en','Troubleshooting'),(8,4,'id','Pemecahan Masalah'),(9,5,'en','Getting Started'),(10,5,'id','Memulai'),(11,6,'en','Account and Billing'),(12,6,'id','Akun dan Tagihan'),(13,7,'en','Features and Guides'),(14,7,'id','Fitur dan Panduan'),(15,8,'en','Troubleshooting'),(16,8,'id','Pemecahan Masalah'),(17,9,'en','Getting Started'),(18,9,'id','Memulai'),(19,10,'en','Account and Billing'),(20,10,'id','Akun dan Tagihan'),(21,11,'en','Features and Guides'),(22,11,'id','Fitur dan Panduan'),(23,12,'en','Troubleshooting'),(24,12,'id','Pemecahan Masalah');
/*!40000 ALTER TABLE `grouptranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES ('hero_bg_color_end','#0f2c07'),('hero_bg_color_start','#196c13'),('hero_bg_image',''),('hero_subtitle_en','Find the answer to your question'),('hero_subtitle_id','Temukan jawaban dari pertanyaanmu'),('hero_title_en','Information Center'),('hero_title_id','Pusat Informasi'),('hover_category_color','#bb8830'),('site_logo','/uploads/1781175930261.JPG'),('site_title','Pusat Informasi');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subgroup`
--

DROP TABLE IF EXISTS `subgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subgroup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SubGroup_groupId_fkey` (`groupId`),
  CONSTRAINT `SubGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subgroup`
--

LOCK TABLES `subgroup` WRITE;
/*!40000 ALTER TABLE `subgroup` DISABLE KEYS */;
INSERT INTO `subgroup` VALUES (1,1,1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(2,1,2,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(3,2,1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(4,3,1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(5,4,1,'2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(6,5,1,'2026-06-11 09:26:14.100','2026-06-11 09:26:14.100'),(7,5,2,'2026-06-11 09:26:14.105','2026-06-11 09:26:14.105'),(8,6,1,'2026-06-11 09:26:14.111','2026-06-11 09:26:14.111'),(9,7,1,'2026-06-11 09:26:14.118','2026-06-11 09:26:14.118'),(10,8,1,'2026-06-11 09:26:14.122','2026-06-11 09:26:14.122'),(11,9,1,'2026-06-11 10:24:16.700','2026-06-11 10:24:16.700'),(12,9,2,'2026-06-11 10:24:16.708','2026-06-11 10:24:16.708'),(13,10,1,'2026-06-11 10:24:16.717','2026-06-11 10:24:16.717'),(14,11,1,'2026-06-11 10:24:16.726','2026-06-11 10:24:16.726'),(15,12,1,'2026-06-11 10:24:16.734','2026-06-11 10:24:16.734');
/*!40000 ALTER TABLE `subgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subgrouptranslation`
--

DROP TABLE IF EXISTS `subgrouptranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subgrouptranslation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subgroupId` int NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SubGroupTranslation_subgroupId_locale_key` (`subgroupId`,`locale`),
  CONSTRAINT `SubGroupTranslation_subgroupId_fkey` FOREIGN KEY (`subgroupId`) REFERENCES `subgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subgrouptranslation`
--

LOCK TABLES `subgrouptranslation` WRITE;
/*!40000 ALTER TABLE `subgrouptranslation` DISABLE KEYS */;
INSERT INTO `subgrouptranslation` VALUES (1,1,'en','Quick Start'),(2,1,'id','Mulai Cepat'),(3,2,'en','Account Setup'),(4,2,'id','Pengaturan Akun'),(5,3,'en','Subscription Plans'),(6,3,'id','Paket Langganan'),(7,4,'en','Core Features'),(8,4,'id','Fitur Utama'),(9,5,'en','Common Issues'),(10,5,'id','Masalah Umum'),(11,6,'en','Quick Start'),(12,6,'id','Mulai Cepat'),(13,7,'en','Account Setup'),(14,7,'id','Pengaturan Akun'),(15,8,'en','Subscription Plans'),(16,8,'id','Paket Langganan'),(17,9,'en','Core Features'),(18,9,'id','Fitur Utama'),(19,10,'en','Common Issues'),(20,10,'id','Masalah Umum'),(21,11,'en','Quick Start'),(22,11,'id','Mulai Cepat'),(23,12,'en','Account Setup'),(24,12,'id','Pengaturan Akun'),(25,13,'en','Subscription Plans'),(26,13,'id','Paket Langganan'),(27,14,'en','Core Features'),(28,14,'id','Fitur Utama'),(29,15,'en','Common Issues'),(30,15,'id','Masalah Umum');
/*!40000 ALTER TABLE `subgrouptranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@kmc.com','$2b$10$vSwlzGv1eD6adWx6sTXWRuD2JRkYKZ1vrcRlCGFF6hRFHOYfQH2TK','Admin KMC','ADMIN','2026-06-11 09:19:42.000','2026-06-11 09:19:42.000'),(2,'internal@kmc.com','$2b$10$jNUbEYx/kM55TV0BRZodFurAwmdpd58u1qaeGrb0xxjPKgVxktG7u','Internal User','INTERNAL','2026-06-11 09:19:42.000','2026-06-11 09:19:42.000');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'kmc'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-11 18:56:46
