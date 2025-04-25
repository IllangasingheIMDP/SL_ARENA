-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (x86_64)
--
-- Host: mysql-b7f3425-ashidudissanayake1-e121.i.aivencloud.com    Database: slarena
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '1158fb8d-139d-11f0-a513-92fa923eee74:1-15,
8f4a679a-8537-11ef-8522-06475c51ddd1:1-1891,
a561a6c6-1d6c-11f0-9121-deee2fdee939:1-516,
dd2f23a7-f270-11ef-8558-269e5f4f1971:1-15';

--
-- Table structure for table `Achievements`
--

DROP TABLE IF EXISTS `Achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Achievements` (
  `achievement_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int DEFAULT NULL,
  `achievement_type` varchar(50) DEFAULT NULL,
  `match_id` int DEFAULT NULL,
  `date_achieved` date DEFAULT NULL,
  PRIMARY KEY (`achievement_id`),
  KEY `match_id` (`match_id`),
  KEY `idx_player_id` (`player_id`),
  CONSTRAINT `Achievements_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`),
  CONSTRAINT `Achievements_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Achievements`
--

LOCK TABLES `Achievements` WRITE;
/*!40000 ALTER TABLE `Achievements` DISABLE KEYS */;
INSERT INTO `Achievements` VALUES (2,1,'Half-Century',1,NULL);
/*!40000 ALTER TABLE `Achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Deliveries`
--

DROP TABLE IF EXISTS `Deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Deliveries` (
  `delivery_id` int NOT NULL AUTO_INCREMENT,
  `inning_id` int DEFAULT NULL,
  `over_number` int DEFAULT NULL,
  `ball_number` int DEFAULT NULL,
  `batsman_id` int DEFAULT NULL,
  `bowler_id` int DEFAULT NULL,
  `runs_scored` int DEFAULT '0',
  `extras` int DEFAULT '0',
  `wicket` tinyint(1) DEFAULT '0',
  `dismissal_type` varchar(50) DEFAULT NULL,
  `extra_type` enum('wide','no ball','legbys','penalty') DEFAULT NULL,
  PRIMARY KEY (`delivery_id`),
  KEY `batsman_id` (`batsman_id`),
  KEY `bowler_id` (`bowler_id`),
  KEY `idx_inning_id` (`inning_id`),
  KEY `idx_over_ball` (`over_number`,`ball_number`),
  CONSTRAINT `Deliveries_ibfk_1` FOREIGN KEY (`inning_id`) REFERENCES `Innings` (`inning_id`),
  CONSTRAINT `Deliveries_ibfk_2` FOREIGN KEY (`batsman_id`) REFERENCES `Players` (`player_id`),
  CONSTRAINT `Deliveries_ibfk_3` FOREIGN KEY (`bowler_id`) REFERENCES `Players` (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Deliveries`
--

LOCK TABLES `Deliveries` WRITE;
/*!40000 ALTER TABLE `Deliveries` DISABLE KEYS */;
INSERT INTO `Deliveries` VALUES (1,2,2,1,1,2,3,0,0,NULL,NULL),(2,2,2,3,1,2,4,0,1,'Catch',NULL),(3,2,2,6,2,1,10,0,0,NULL,'penalty'),(4,2,3,1,1,2,3,0,0,NULL,NULL),(5,2,3,2,2,1,6,0,0,NULL,NULL);
/*!40000 ALTER TABLE `Deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Innings`
--

DROP TABLE IF EXISTS `Innings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Innings` (
  `inning_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int DEFAULT NULL,
  `batting_team_id` int DEFAULT NULL,
  `bowling_team_id` int DEFAULT NULL,
  `inning_number` int DEFAULT NULL,
  `total_runs` int DEFAULT '0',
  `total_wickets` int DEFAULT '0',
  `overs_played` decimal(4,1) DEFAULT NULL,
  PRIMARY KEY (`inning_id`),
  KEY `batting_team_id` (`batting_team_id`),
  KEY `bowling_team_id` (`bowling_team_id`),
  KEY `idx_match_id` (`match_id`),
  CONSTRAINT `Innings_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`),
  CONSTRAINT `Innings_ibfk_2` FOREIGN KEY (`batting_team_id`) REFERENCES `Teams` (`team_id`),
  CONSTRAINT `Innings_ibfk_3` FOREIGN KEY (`bowling_team_id`) REFERENCES `Teams` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Innings`
--

LOCK TABLES `Innings` WRITE;
/*!40000 ALTER TABLE `Innings` DISABLE KEYS */;
INSERT INTO `Innings` VALUES (1,1,1,2,1,256,4,50.0),(2,1,2,1,2,17,1,0.5),(3,2,1,2,1,0,0,NULL),(4,3,1,2,1,0,0,NULL);
/*!40000 ALTER TABLE `Innings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Match_Ratings`
--

DROP TABLE IF EXISTS `Match_Ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Match_Ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_match_id` (`match_id`),
  CONSTRAINT `Match_Ratings_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`),
  CONSTRAINT `Match_Ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Match_Ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Match_Ratings`
--

LOCK TABLES `Match_Ratings` WRITE;
/*!40000 ALTER TABLE `Match_Ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Match_Ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Matches`
--

DROP TABLE IF EXISTS `Matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Matches` (
  `match_id` int NOT NULL AUTO_INCREMENT,
  `organizer_id` int DEFAULT NULL,
  `venue_id` int DEFAULT NULL,
  `team1_id` int DEFAULT NULL,
  `team2_id` int DEFAULT NULL,
  `match_date` date DEFAULT NULL,
  `match_time` time DEFAULT NULL,
  `match_type` varchar(50) DEFAULT NULL,
  `overs` int DEFAULT NULL,
  `status` enum('pending_approval','approved','upcoming','ongoing','completed') DEFAULT 'pending_approval',
  `result` varchar(255) DEFAULT NULL,
  `tournament_id` int DEFAULT NULL,
  `round` int DEFAULT NULL,
  `match_number` int DEFAULT NULL,
  `winner_id` int DEFAULT NULL,
  `phase` enum('toss','team_selection','inning_one','inning_two','finished') DEFAULT 'toss',
  PRIMARY KEY (`match_id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `venue_id` (`venue_id`),
  KEY `team1_id` (`team1_id`),
  KEY `team2_id` (`team2_id`),
  KEY `idx_match_date` (`match_date`),
  KEY `idx_status` (`status`),
  KEY `tournament_id` (`tournament_id`),
  CONSTRAINT `Matches_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `Organizers` (`organizer_id`),
  CONSTRAINT `Matches_ibfk_2` FOREIGN KEY (`venue_id`) REFERENCES `Venues` (`venue_id`),
  CONSTRAINT `Matches_ibfk_3` FOREIGN KEY (`team1_id`) REFERENCES `Teams` (`team_id`),
  CONSTRAINT `Matches_ibfk_4` FOREIGN KEY (`team2_id`) REFERENCES `Teams` (`team_id`),
  CONSTRAINT `Matches_ibfk_5` FOREIGN KEY (`tournament_id`) REFERENCES `Tournaments` (`tournament_id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Matches`
--

LOCK TABLES `Matches` WRITE;
/*!40000 ALTER TABLE `Matches` DISABLE KEYS */;
INSERT INTO `Matches` VALUES (1,NULL,1,1,2,'2025-04-24',NULL,'ODI',20,'pending_approval',NULL,NULL,NULL,NULL,NULL,'toss'),(2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'pending_approval',NULL,NULL,NULL,NULL,NULL,'toss'),(3,NULL,1,1,2,'2024-04-28',NULL,'T20',20,'ongoing',NULL,NULL,NULL,NULL,NULL,'toss'),(5,NULL,1,1,2,NULL,NULL,NULL,NULL,'pending_approval',NULL,NULL,NULL,NULL,NULL,'toss'),(109,NULL,NULL,3,1,NULL,NULL,NULL,NULL,'pending_approval',NULL,10,1,1,NULL,'toss'),(110,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'pending_approval',NULL,10,2,2,NULL,'toss');
/*!40000 ALTER TABLE `Matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `notification_type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
INSERT INTO `Notifications` VALUES (1,2,'Hello Hiruna','General',1,'2025-04-24 16:49:13'),(2,2,'Hello man dog','General',1,'2025-04-24 17:46:28'),(3,2,'go away','General',1,'2025-04-24 18:01:36'),(4,2,'gosasa away','General',1,'2025-04-24 18:03:38'),(5,2,'gosasa awfxfxay','General',1,'2025-04-24 18:03:56'),(6,2,'gosasadsdsdsdsds awfxfxay','General',1,'2025-04-24 18:22:34'),(7,2,'fdsdsdsdsdsdsdsdsdawfxfxay','General',1,'2025-04-24 18:23:56'),(8,2,'xxcxcxcxcxcxcxc','General',1,'2025-04-24 18:41:02'),(9,2,'x','General',1,'2025-04-24 18:50:39'),(10,2,'y','General',1,'2025-04-24 18:53:44'),(11,2,'b','General',1,'2025-04-24 18:57:46'),(12,2,'rb','General',1,'2025-04-24 18:59:33'),(13,2,'rcxcb','General',1,'2025-04-24 19:06:19'),(14,2,'444444','General',1,'2025-04-24 19:06:47'),(15,1,'Important: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:23:54'),(16,2,'Important: System maintenance scheduled for tomorrow','system',1,'2025-04-24 19:23:54'),(17,3,'Important: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:23:54'),(18,4,'Important: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:23:54'),(19,5,'Important: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:23:54'),(20,1,'Important notice: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:25:03'),(21,2,'Important notice: System maintenance scheduled for tomorrow','system',1,'2025-04-24 19:25:03'),(22,3,'Important notice: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:25:03'),(23,4,'Important notice: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:25:03'),(24,5,'Important notice: System maintenance scheduled for tomorrow','system',0,'2025-04-24 19:25:03'),(25,1,'Important notice: System mmmmmmmmmmmmaintenance scheduled for tomorrow','system',0,'2025-04-24 19:32:06'),(26,2,'Important notice: System mmmmmmmmmmmmaintenance scheduled for tomorrow','system',1,'2025-04-24 19:32:06'),(27,3,'Important notice: System mmmmmmmmmmmmaintenance scheduled for tomorrow','system',0,'2025-04-24 19:32:06'),(28,4,'Important notice: System mmmmmmmmmmmmaintenance scheduled for tomorrow','system',0,'2025-04-24 19:32:06'),(29,5,'Important notice: System mmmmmmmmmmmmaintenance scheduled for tomorrow','system',0,'2025-04-24 19:32:06'),(30,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 19:32:36'),(31,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 19:35:10'),(32,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 19:47:46'),(33,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 19:58:27'),(34,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 20:00:47'),(35,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 20:02:14'),(36,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 20:07:18'),(37,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 20:09:06'),(38,2,'rcxccccccccccccccccccccb','General',1,'2025-04-24 20:10:01'),(39,8,'rcxccccccccccccccccccccb','General',1,'2025-04-25 04:30:30'),(40,8,'rcxccccccccccccccccccccb','General',1,'2025-04-25 04:33:18');
/*!40000 ALTER TABLE `Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Organizers`
--

DROP TABLE IF EXISTS `Organizers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Organizers` (
  `organizer_id` int NOT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `organization_details` text,
  PRIMARY KEY (`organizer_id`),
  KEY `idx_organizer_id` (`organizer_id`),
  CONSTRAINT `Organizers_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Organizers`
--

LOCK TABLES `Organizers` WRITE;
/*!40000 ALTER TABLE `Organizers` DISABLE KEYS */;
INSERT INTO `Organizers` VALUES (1,'Scope','We love cricket'),(8,'rty',NULL),(14,'Lishuu',NULL);
/*!40000 ALTER TABLE `Organizers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Photos`
--

DROP TABLE IF EXISTS `Photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Photos` (
  `photo_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `match_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `photo_url` varchar(255) NOT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`photo_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_match_id` (`match_id`),
  CONSTRAINT `Photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Photos_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Photos`
--

LOCK TABLES `Photos` WRITE;
/*!40000 ALTER TABLE `Photos` DISABLE KEYS */;
INSERT INTO `Photos` VALUES (1,8,NULL,'H','dsd','https://res.cloudinary.com/dacknfqtw/image/upload/v1745457238/gom5mvvlbqrtjdlv56mp.png','2025-04-24 01:13:59'),(3,2,NULL,'Hello','Viva la fiesta','https://res.cloudinary.com/dacknfqtw/image/upload/v1745457747/le4voqsvtrt2pg3an8ss.jpg','2025-04-24 01:22:28'),(4,2,NULL,'Hn','Hnn','https://res.cloudinary.com/dacknfqtw/image/upload/v1745589217/udm0alnhctpj1heplq6r.jpg','2025-04-25 13:53:39'),(5,2,NULL,'Cxd','Vgg','https://res.cloudinary.com/dacknfqtw/image/upload/v1745589651/lqaksxvkwilas2j32chh.jpg','2025-04-25 14:00:52');
/*!40000 ALTER TABLE `Photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Player_Match_Stats`
--

DROP TABLE IF EXISTS `Player_Match_Stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Player_Match_Stats` (
  `player_id` int NOT NULL,
  `match_id` int NOT NULL,
  `runs_scored` int DEFAULT '0',
  `balls_faced` int DEFAULT '0',
  `fours` int DEFAULT '0',
  `sixes` int DEFAULT '0',
  `wickets_taken` int DEFAULT '0',
  `overs_bowled` decimal(4,1) DEFAULT '0.0',
  `runs_conceded` int DEFAULT '0',
  PRIMARY KEY (`player_id`,`match_id`),
  KEY `match_id` (`match_id`),
  KEY `idx_player_match` (`player_id`,`match_id`),
  CONSTRAINT `Player_Match_Stats_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`),
  CONSTRAINT `Player_Match_Stats_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Player_Match_Stats`
--

LOCK TABLES `Player_Match_Stats` WRITE;
/*!40000 ALTER TABLE `Player_Match_Stats` DISABLE KEYS */;
INSERT INTO `Player_Match_Stats` VALUES (1,1,37,11,4,0,0,1.1,58),(2,1,58,7,0,3,4,1.8,37);
/*!40000 ALTER TABLE `Player_Match_Stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Player_Ratings`
--

DROP TABLE IF EXISTS `Player_Ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Player_Ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_player_id` (`player_id`),
  CONSTRAINT `Player_Ratings_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`),
  CONSTRAINT `Player_Ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Player_Ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Player_Ratings`
--

LOCK TABLES `Player_Ratings` WRITE;
/*!40000 ALTER TABLE `Player_Ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Player_Ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Players`
--

DROP TABLE IF EXISTS `Players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Players` (
  `player_id` int NOT NULL,
  `bio` text,
  `batting_style` varchar(50) DEFAULT NULL,
  `bowling_style` varchar(50) DEFAULT NULL,
  `fielding_position` varchar(50) DEFAULT NULL,
  `training_schedule` text,
  `batting_points` int DEFAULT '0',
  `bowling_points` int DEFAULT '0',
  `allrounder_points` int GENERATED ALWAYS AS ((`batting_points` + `bowling_points`)) STORED,
  `role` enum('batting','bowling','allrounder') DEFAULT NULL,
  PRIMARY KEY (`player_id`),
  KEY `idx_player_id` (`player_id`),
  CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Players`
--

LOCK TABLES `Players` WRITE;
/*!40000 ALTER TABLE `Players` DISABLE KEYS */;
INSERT INTO `Players` (`player_id`, `bio`, `batting_style`, `bowling_style`, `fielding_position`, `training_schedule`, `batting_points`, `bowling_points`, `role`) VALUES (1,'Loves cricket','Right handed','Rigt arm fast','Wicket keeper',NULL,50,6,'allrounder'),(2,'born to win today tomorrow','Left Hand fast','Right arm fast','Long on go onvggg',NULL,100,8,'allrounder'),(3,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(4,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(5,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(6,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(7,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(8,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(9,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(10,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(11,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(12,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(13,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL),(14,'born to win today tomorrow',NULL,NULL,NULL,NULL,0,0,NULL);
/*!40000 ALTER TABLE `Players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reports`
--

DROP TABLE IF EXISTS `Reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `reporter_id` int DEFAULT NULL,
  `reported_user_id` int DEFAULT NULL,
  `reported_match_id` int DEFAULT NULL,
  `report_type` varchar(50) DEFAULT NULL,
  `description` text,
  `status` enum('open','resolved') DEFAULT 'open',
  `resolved_by` int DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `reported_user_id` (`reported_user_id`),
  KEY `reported_match_id` (`reported_match_id`),
  KEY `resolved_by` (`resolved_by`),
  KEY `idx_reporter_id` (`reporter_id`),
  CONSTRAINT `Reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Reports_ibfk_2` FOREIGN KEY (`reported_user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Reports_ibfk_3` FOREIGN KEY (`reported_match_id`) REFERENCES `Matches` (`match_id`),
  CONSTRAINT `Reports_ibfk_4` FOREIGN KEY (`resolved_by`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reports`
--

LOCK TABLES `Reports` WRITE;
/*!40000 ALTER TABLE `Reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role_Upgrade_Requests`
--

DROP TABLE IF EXISTS `Role_Upgrade_Requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role_Upgrade_Requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `requested_role` enum('player','organisation','admin','trainer') DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `Role_Upgrade_Requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role_Upgrade_Requests`
--

LOCK TABLES `Role_Upgrade_Requests` WRITE;
/*!40000 ALTER TABLE `Role_Upgrade_Requests` DISABLE KEYS */;
INSERT INTO `Role_Upgrade_Requests` VALUES (1,2,'trainer','approved','2025-04-25 15:49:03','2025-04-25 18:35:04'),(6,11,'player','rejected','2025-04-25 17:14:51','2025-04-25 18:04:31'),(7,14,'organisation','approved','2025-04-25 17:30:37','2025-04-25 18:02:42');
/*!40000 ALTER TABLE `Role_Upgrade_Requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Team_Players`
--

DROP TABLE IF EXISTS `Team_Players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Team_Players` (
  `team_id` int NOT NULL,
  `player_id` int NOT NULL,
  `role` enum('Batsman','Bowler','All-Rounder','Wicket-Keeper') DEFAULT NULL,
  PRIMARY KEY (`team_id`,`player_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `Team_Players_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `Teams` (`team_id`) ON DELETE CASCADE,
  CONSTRAINT `Team_Players_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Team_Players`
--

LOCK TABLES `Team_Players` WRITE;
/*!40000 ALTER TABLE `Team_Players` DISABLE KEYS */;
INSERT INTO `Team_Players` VALUES (1,2,NULL),(1,3,NULL),(1,4,NULL),(1,5,NULL),(1,6,NULL),(1,10,NULL),(3,8,NULL),(3,9,NULL),(3,10,NULL),(3,11,NULL),(3,12,NULL),(5,5,'All-Rounder');
/*!40000 ALTER TABLE `Team_Players` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`avnadmin`@`%`*/ /*!50003 TRIGGER `before_team_players_insert` BEFORE INSERT ON `Team_Players` FOR EACH ROW BEGIN
    DECLARE team_captain_id INT;

    -- Get the captain_id for the team
    SELECT captain_id INTO team_captain_id
    FROM Teams
    WHERE team_id = NEW.team_id;

    -- Check if the player_id matches the captain_id
    IF team_captain_id IS NOT NULL AND NEW.player_id = team_captain_id THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Player cannot be added to Team_Players if they are the team captain';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Teams`
--

DROP TABLE IF EXISTS `Teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Teams` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` varchar(255) NOT NULL,
  `captain_id` int DEFAULT NULL,
  `points` int DEFAULT '0',
  PRIMARY KEY (`team_id`),
  KEY `captain_id` (`captain_id`),
  KEY `idx_team_name` (`team_name`),
  CONSTRAINT `Teams_ibfk_1` FOREIGN KEY (`captain_id`) REFERENCES `Players` (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teams`
--

LOCK TABLES `Teams` WRITE;
/*!40000 ALTER TABLE `Teams` DISABLE KEYS */;
INSERT INTO `Teams` VALUES (1,'SriLanka',1,0),(2,'India',2,0),(3,'Aus',7,0),(4,'NZ',1,0),(5,'Pakistan',2,0),(6,'Ban',1,0);
/*!40000 ALTER TABLE `Teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tournament_Matches`
--

DROP TABLE IF EXISTS `Tournament_Matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tournament_Matches` (
  `tournament_id` int NOT NULL,
  `match_id` int NOT NULL,
  `round` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`tournament_id`,`match_id`),
  KEY `match_id` (`match_id`),
  CONSTRAINT `Tournament_Matches_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `Tournaments` (`tournament_id`) ON DELETE CASCADE,
  CONSTRAINT `Tournament_Matches_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tournament_Matches`
--

LOCK TABLES `Tournament_Matches` WRITE;
/*!40000 ALTER TABLE `Tournament_Matches` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tournament_Matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tournaments`
--

DROP TABLE IF EXISTS `Tournaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tournaments` (
  `tournament_id` int NOT NULL AUTO_INCREMENT,
  `organizer_id` int DEFAULT NULL,
  `tournament_name` varchar(255) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `tournament_type` varchar(50) DEFAULT NULL,
  `rules` text,
  `status` enum('upcoming','start','matches','finished') DEFAULT NULL,
  `venue_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`tournament_id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `idx_start_date` (`start_date`),
  KEY `Tournaments_ibfk_2` (`venue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tournaments`
--

LOCK TABLES `Tournaments` WRITE;
/*!40000 ALTER TABLE `Tournaments` DISABLE KEYS */;
INSERT INTO `Tournaments` VALUES (10,8,'Vvybun','2000-10-02','2000-10-11','T','Kak','matches','ChIJRb6L8AMK4zoRE8ZWeP-KTVU'),(11,8,'Ans','2000-10-11','2000-12-23','Tep','Jaka','upcoming','ChIJOyCz38vw4joRB2BgqAR5UhM'),(15,8,'Crick Fiesta','2025-04-27','2025-04-30','T20','Wear white','upcoming','ChIJtTR_a0FF4joRDlYCqyEn03s');
/*!40000 ALTER TABLE `Tournaments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Trainers`
--

DROP TABLE IF EXISTS `Trainers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Trainers` (
  `trainer_id` int NOT NULL,
  `bio` text,
  `trainer_type` varchar(50) DEFAULT NULL,
  `club` varchar(100) DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `verification_document_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`trainer_id`),
  KEY `idx_trainer_id` (`trainer_id`),
  CONSTRAINT `Trainers_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Trainers`
--

LOCK TABLES `Trainers` WRITE;
/*!40000 ALTER TABLE `Trainers` DISABLE KEYS */;
INSERT INTO `Trainers` VALUES (14,'wrtaw','rga','aerea',3,NULL);
/*!40000 ALTER TABLE `Trainers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Training_Sessions`
--

DROP TABLE IF EXISTS `Training_Sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Training_Sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int DEFAULT NULL,
  `session_date` date DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `focus_area` varchar(50) DEFAULT NULL,
  `notes` text,
  `trainer_id` int DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  KEY `idx_player_id` (`player_id`),
  CONSTRAINT `Training_Sessions_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Training_Sessions`
--

LOCK TABLES `Training_Sessions` WRITE;
/*!40000 ALTER TABLE `Training_Sessions` DISABLE KEYS */;
INSERT INTO `Training_Sessions` VALUES (1,1,'2025-04-30',30,'Batting','Supiri exercise',NULL);
/*!40000 ALTER TABLE `Training_Sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'kasun@gmail.com','sdq4','Kasun Dilhara','[\"general\", \"player\"]','2025-04-23 02:27:06','2025-04-25 17:14:09'),(2,'nimeshhiruna@gmail.com','$2b$10$O1C5kxPsrEDaKz6kwyXHkuDPTq8EHi.Ia9M1ilVoGvPAmKls86SK.','Hiruna Nimesh','[\"player\", \"general\"]','2025-04-23 03:55:16','2025-04-25 18:36:48'),(3,'john.doe@example.com','$2b$10$FsW3Hd4rilpmI6TKAuKoVuNhC4Tg9UZoDfbfE9Aj62IuNa3jaQKvy','John Doe','[\"general\", \"player\"]','2025-04-23 09:07:14','2025-04-25 13:44:52'),(4,'john2.doe@example.com','$2b$10$KyG5YQPuB6j1iXQuQL1bMetOC8AKGPEIn7tepMmeJbTX.lmnTcNzG','John2 Doe','[\"general\", \"player\"]','2025-04-23 09:32:59','2025-04-25 13:44:53'),(5,'t@gmail.com','$2b$10$8GZ1EtE5PKBnlVCzvd4A2OdRwCaf3UmowD.7X8OILnfxhPJiqx3L6','Dasun','[\"general\", \"player\"]','2025-04-23 09:40:57','2025-04-25 13:44:53'),(6,'e@gmail.com','$2b$10$/Fi81Jvb0Wj8M73JEo1g1eOsNuA3hS6iDSKNFa592DbIVG.GYEr9e','Dasun','[\"general\", \"player\"]','2025-04-23 09:43:44','2025-04-25 13:44:54'),(7,'ashidu@gmail.com','$2b$10$5wl7kFMTYJeue99pld2Cq.gE3EEbcUXVoJxTYGUDb1BGzWYcU0jSO','Ashidu','[\"general\", \"player\"]','2025-04-23 11:04:07','2025-04-25 13:44:54'),(8,'ashidu1@gmail.com','$2b$10$ZtpG7VAegp2s7bwBYv8Fp.q9cYjRMlYo6GmfyrAQN3Ke0RSQG5Lr.','Ashidu123','[\"general\", \"player\", \"organisation\"]','2025-04-23 11:08:42','2025-04-25 17:28:31'),(9,'hirunanimesh@gmail.com','$2b$10$xlxZXYjuYqRh3pLvkgv2autUxYv4KMgKNtzs.ND8EQpWLnZ30KTGW','U.jayasinghe','[\"general\", \"player\"]','2025-04-23 11:50:46','2025-04-25 13:44:55'),(10,'kasun333@gmail.com','$2b$10$RANwW70fwkLpXuVC9RKU0ePdWnn/HplsWxSCXPSTC/8AFpm22rJ/6','Kasun','[\"general\", \"player\"]','2025-04-23 11:52:11','2025-04-25 13:44:56'),(11,'kusal@gmail.com','$2b$10$yaylTltPKfY5YXgT1bgxvehtCoTlY8grCFjDDx7rYu39Q.1QvAMLW','Kusal Mendis','[\"general\"]','2025-04-23 11:52:49','2025-04-25 17:14:27'),(12,'hello@gmail.com','$2b$10$DWGfgpbbpJ0JvpPRYURXhOae88Ozqf1cyLY6LzmvO.CwyAQUVOBEW','Hello','[\"general\", \"organisation\"]','2025-04-23 21:27:30','2025-04-25 16:55:36'),(13,'kasun12@gmail.com','$2b$10$1jx2hkOE0owbT9nPkxLR3ujS7MK/hBSrHGyVhP3a7li2WrfQ9VEWy','Kasun','[\"general\", \"player\"]','2025-04-23 22:12:06','2025-04-25 13:44:57'),(14,'lishani@gmail.com','$2b$10$uQX/MdeDlZLKJYFw8eikGOsZ2PLJvYwsrkd35IteUGU.OxUe/n0n.','Lishani','[\"general\", \"player\", \"trainer\"]','2025-04-25 01:30:34','2025-04-25 18:36:47'),(15,'das@gmail.com','$2b$10$6kYTTXMm2/EB2fujTO5TJ.cOznba94OrGlxJBifmw94m6NHCvDeKC','Dasun','[\"admin\"]','2025-04-25 15:13:25','2025-04-25 16:14:08');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`avnadmin`@`%`*/ /*!50003 TRIGGER `set_default_role` BEFORE INSERT ON `Users` FOR EACH ROW BEGIN
  IF NEW.role IS NULL THEN
    SET NEW.role = JSON_ARRAY('general');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Venues`
--

DROP TABLE IF EXISTS `Venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Venues` (
  `venue_id` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  PRIMARY KEY (`venue_id`),
  KEY `idx_location` (`latitude`,`longitude`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Venues`
--

LOCK TABLES `Venues` WRITE;
/*!40000 ALTER TABLE `Venues` DISABLE KEYS */;
INSERT INTO `Venues` VALUES (1,'Pallekale',NULL,'Kandy',NULL,'Srilanka',NULL,NULL,20000),(2,'jkndjnd',NULL,'jhsdnsndc',NULL,'jshfnj',NULL,NULL,6355),(3,'jkndjnd',NULL,'jhsdnsndc',NULL,'jshfnj',NULL,NULL,6355),(4,'warakapola',NULL,'kegalle',NULL,'Sri lanka',NULL,NULL,2500),(5,'warakapola',NULL,'kegalle',NULL,'Sri lanka',NULL,NULL,2500),(6,'Kssksn',NULL,'Bsss',NULL,'Sbss',NULL,NULL,4555);
/*!40000 ALTER TABLE `Venues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Videos`
--

DROP TABLE IF EXISTS `Videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Videos` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `match_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `video_url` varchar(255) NOT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`video_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_match_id` (`match_id`),
  CONSTRAINT `Videos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Videos_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Videos`
--

LOCK TABLES `Videos` WRITE;
/*!40000 ALTER TABLE `Videos` DISABLE KEYS */;
INSERT INTO `Videos` VALUES (3,2,NULL,'Songs3','Katakaaranam | Iraj Weeraratne | Killer B | Kushani Sandarekha | Official Music Video | Sinhala Songs  | Sinhala Sindu | Sinhala Rap | Sri Lanka ??','https://youtu.be/8cs92vf07ac?si=em7l7qKrVlx8Ry0r','2025-04-24 01:26:05'),(6,2,NULL,'Mal','Katakaaranam | Iraj Weeraratne | Killer B | Kushani Sandarekha | Official Music Video | Sinhala Songs  | Sinhala Sindu | Sinhala Rap | Sri Lanka ??','https://youtu.be/6bhFve62TMs?si=jrVZJdH0SXSBulEg','2025-04-25 14:11:30');
/*!40000 ALTER TABLE `Videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player_videos`
--

DROP TABLE IF EXISTS `player_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_videos` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `description` text,
  `video_url` varchar(255) NOT NULL,
  `upload_date` date NOT NULL,
  PRIMARY KEY (`video_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `player_videos_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_videos`
--

LOCK TABLES `player_videos` WRITE;
/*!40000 ALTER TABLE `player_videos` DISABLE KEYS */;
INSERT INTO `player_videos` VALUES (1,2,'new video in pakistan.','http/cricket/sriLanka','2025-04-23');
/*!40000 ALTER TABLE `player_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playing_11`
--

DROP TABLE IF EXISTS `playing_11`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playing_11` (
  `match_id` int NOT NULL,
  `player_id` int NOT NULL,
  PRIMARY KEY (`match_id`,`player_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `playing_11_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `Matches` (`match_id`) ON DELETE CASCADE,
  CONSTRAINT `playing_11_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playing_11`
--

LOCK TABLES `playing_11` WRITE;
/*!40000 ALTER TABLE `playing_11` DISABLE KEYS */;
INSERT INTO `playing_11` VALUES (5,1),(3,2),(5,2),(109,2),(3,3),(5,3),(109,3),(109,4),(109,6),(109,8),(109,9),(109,10),(109,12);
/*!40000 ALTER TABLE `playing_11` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournament_applicants`
--

DROP TABLE IF EXISTS `tournament_applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament_applicants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `team_id` int NOT NULL,
  `status` enum('applied','accepted','rejected','present') NOT NULL DEFAULT 'applied',
  `payment` enum('complete','incomplete') NOT NULL DEFAULT 'incomplete',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `attendance` tinyint(1) DEFAULT '0',
  `payment_slip` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament_applicants`
--

LOCK TABLES `tournament_applicants` WRITE;
/*!40000 ALTER TABLE `tournament_applicants` DISABLE KEYS */;
INSERT INTO `tournament_applicants` VALUES (1,10,1,'accepted','complete','2025-04-23 19:49:02','2025-04-25 15:11:47',1,NULL),(2,10,2,'accepted','incomplete','2025-04-23 20:42:35','2025-04-25 12:28:51',1,NULL),(3,10,3,'accepted','incomplete','2025-04-24 19:27:45','2025-04-25 12:28:51',1,NULL),(4,10,4,'accepted','incomplete','2025-04-25 02:28:21','2025-04-25 12:39:36',0,NULL),(5,3,1,'accepted','incomplete','2025-04-25 03:16:03','2025-04-25 14:28:42',1,NULL),(9,11,1,'applied','incomplete','2025-04-25 05:05:31','2025-04-25 15:03:29',1,NULL),(10,5,2,'applied','incomplete','2025-04-25 05:05:53','2025-04-25 05:05:53',1,NULL),(11,5,3,'applied','incomplete','2025-04-25 05:07:19','2025-04-25 05:07:59',1,NULL),(12,5,4,'applied','incomplete','2025-04-25 05:07:31','2025-04-25 05:08:00',1,NULL),(13,5,5,'applied','incomplete','2025-04-25 05:07:42','2025-04-25 05:08:00',1,NULL),(14,10,5,'applied','incomplete','2025-04-25 05:39:55','2025-04-25 14:28:41',1,NULL),(15,10,2,'applied','incomplete','2025-04-25 05:39:55','2025-04-25 12:28:51',1,NULL),(16,10,3,'applied','incomplete','2025-04-25 05:39:56','2025-04-25 12:28:51',1,NULL),(17,10,4,'applied','incomplete','2025-04-25 05:39:56','2025-04-25 12:39:36',0,NULL),(18,10,5,'applied','incomplete','2025-04-25 05:39:57','2025-04-25 10:29:53',1,NULL),(19,10,6,'applied','incomplete','2025-04-25 08:45:03','2025-04-25 10:29:54',1,NULL),(20,10,7,'applied','incomplete','2025-04-25 10:27:48','2025-04-25 10:27:48',0,NULL),(21,11,2,'applied','incomplete','2025-04-25 21:23:31','2025-04-25 21:23:31',0,NULL),(22,12,2,'applied','incomplete','2025-04-25 21:23:42','2025-04-25 21:23:42',0,NULL),(23,15,2,'applied','incomplete','2025-04-25 21:24:08','2025-04-25 21:24:08',0,NULL),(24,11,5,'applied','incomplete','2025-04-25 21:30:36','2025-04-25 21:30:36',0,NULL);
/*!40000 ALTER TABLE `tournament_applicants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournament_invites`
--

DROP TABLE IF EXISTS `tournament_invites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament_invites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `team_id` int NOT NULL,
  `status` enum('Invited','Accepted','Rejected') NOT NULL DEFAULT 'Invited',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament_invites`
--

LOCK TABLES `tournament_invites` WRITE;
/*!40000 ALTER TABLE `tournament_invites` DISABLE KEYS */;
INSERT INTO `tournament_invites` VALUES (1,2,1,'Invited','2025-04-24 03:57:47','2025-04-24 03:57:47');
/*!40000 ALTER TABLE `tournament_invites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'slarena'
--

--
-- Dumping routines for database 'slarena'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-26  3:21:50
