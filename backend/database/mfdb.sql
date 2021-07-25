-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : dim. 25 juil. 2021 à 15:03
-- Version du serveur :  5.5.62
-- Version de PHP : 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mfdb`
--

-- --------------------------------------------------------

--
-- Structure de la table `Evaluation`
--

CREATE TABLE `Evaluation` (
  `id` bigint(20) NOT NULL,
  `date` datetime DEFAULT NULL,
  `rate` tinyint(1) DEFAULT NULL,
  `comment` text,
  `photo` blob,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `ReservationId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Plate`
--

CREATE TABLE `Plate` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `photo` blob,
  `quantity` float DEFAULT NULL,
  `number` int(11) DEFAULT NULL,
  `comment` text,
  `reserved` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `UserId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Plate`
--

INSERT INTO `Plate` (`id`, `name`, `photo`, `quantity`, `number`, `comment`, `reserved`, `createdAt`, `updatedAt`, `deletedAt`, `UserId`) VALUES
(1, 'test', NULL, 1, 2, 'gbgrr', 0, '2021-07-18 18:09:36', '2021-07-18 18:09:36', NULL, 1),
(2, 'new plat', NULL, 4, 5, 'comment', 0, '2021-07-24 14:09:48', '2021-07-24 14:09:48', NULL, 4),
(3, 'new plat', NULL, 4, 5, 'comment', 0, '2021-07-24 17:27:11', '2021-07-24 17:27:11', NULL, 4),
(4, 'test', 0x70696374757265, 4, 5, 'comment', 0, '2021-07-24 17:49:41', '2021-07-24 17:49:41', NULL, 4),
(5, 'gregeg', 0x70696374757265, 4, 5, 'comment', 0, '2021-07-25 10:30:12', '2021-07-25 10:30:12', NULL, 4);

-- --------------------------------------------------------

--
-- Structure de la table `Recipe`
--

CREATE TABLE `Recipe` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `ingredient` varchar(255) DEFAULT NULL,
  `note` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Recipe`
--

INSERT INTO `Recipe` (`id`, `name`, `ingredient`, `note`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(0, 'test', 'ing,ing,ing', 'note', '2021-07-18 19:08:04', '2021-07-18 19:08:04', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `Reservation`
--

CREATE TABLE `Reservation` (
  `id` bigint(20) NOT NULL,
  `date` datetime DEFAULT NULL,
  `received` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `UserId` bigint(20) DEFAULT NULL,
  `PlateId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Session`
--

CREATE TABLE `Session` (
  `id` bigint(20) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `UserId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Session`
--

INSERT INTO `Session` (`id`, `token`, `createdAt`, `updatedAt`, `deletedAt`, `UserId`) VALUES
(1, '$2b$05$EbPHhowsu221WGwueFR8seH8VcwSf9rFAVakEjLE2AtGiWtGcOszS', '2021-07-18 18:09:12', '2021-07-18 18:09:12', NULL, 1),
(2, '$2b$05$v3fJfBHBlFoGjFXPwlUVuu26wtSGCyjXuWiOsP/FnCn.mtTk0l6QG', '2021-07-18 18:11:35', '2021-07-18 18:11:35', NULL, 1),
(3, '$2b$05$P1zP6OgonzZ2UieCZC9KreD2kjBmGGoHRch3z3valFOOuuvFZxwSO', '2021-07-24 12:54:39', '2021-07-24 12:54:39', NULL, 2),
(4, '$2b$05$aZo2ZRBSlcW4Z9IYV6Vo1OP7lfEZ9v.zh3SvjSZehoritWlJ.ZKsu', '2021-07-24 14:06:54', '2021-07-24 14:06:54', NULL, 4),
(5, '$2b$05$YGsmGY7Z81Uu64Ko4ruaTeE.nu2hCRP6EqGNTILVRHXVB/W8P43Cq', '2021-07-24 17:11:17', '2021-07-24 17:11:17', NULL, 2),
(6, '$2b$05$xurG1BRWLYVWflHMZjUroObhLFjMMC.SJgEN/LlZzOuj7KJGOF2XO', '2021-07-24 17:40:18', '2021-07-24 17:40:18', NULL, 2),
(7, '$2b$05$k60cNgpE2MITA9GulrbF4eRRtJg.6LPfi9Ji07VrSJjlZmk.ezMqG', '2021-07-24 20:41:56', '2021-07-24 20:41:56', NULL, 2),
(8, '$2b$05$DSfJxnqMq9DpshwATP1xfegDKs3FeGPB/M64C2deuT7whTt/xHkKy', '2021-07-25 10:15:05', '2021-07-25 10:15:05', NULL, 2),
(9, '$2b$05$Vsv4fc.zbpvhk8IraBzvbevVTr17Om2A2pNaJc95tOPpcXmvaSt8y', '2021-07-25 10:33:20', '2021-07-25 10:33:20', NULL, 2),
(10, '$2b$05$iTHoUtHoxklJ139s/4QPC.1FonvfsWb9B0aSNO8nMZpezycCh2Baq', '2021-07-25 11:09:15', '2021-07-25 11:09:15', NULL, 2);

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` bigint(20) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `photo` blob,
  `number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zipcode` int(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `cantEat` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`id`, `firstname`, `lastname`, `username`, `password`, `email`, `photo`, `number`, `address`, `zipcode`, `city`, `cantEat`, `bio`, `role`, `isAvailable`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'halisia', 'rfrfrf', 'nerfrfwuser', '$2b$05$0IDrhNFNpWC4txiuENQXuu6nPvDnMNxAktZaMD6V4bFSx8wC3uZ9.', 'rfr.test@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2021-07-18 18:07:48', '2021-07-18 19:58:41', NULL),
(2, 'firstname', 'lastname', 'username', '$2b$05$NmfTmD4ZW6JQlM8hOFac9u2xaJby9CQ2KS0TwRiTKHpzHGVuxPCX2', 'email@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2021-07-24 12:54:19', '2021-07-24 12:54:19', NULL),
(4, 'test', 'test', 'test', '$2b$05$oeIy.Rh0os9XF.QQkORmaOz7JSu2FwARus9yVPoXwd4ytSE0SjEpK', 'testmail@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2021-07-24 14:06:26', '2021-07-24 14:06:26', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Evaluation`
--
ALTER TABLE `Evaluation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ReservationId` (`ReservationId`);

--
-- Index pour la table `Plate`
--
ALTER TABLE `Plate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Index pour la table `Recipe`
--
ALTER TABLE `Recipe`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Reservation`
--
ALTER TABLE `Reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `PlateId` (`PlateId`);

--
-- Index pour la table `Session`
--
ALTER TABLE `Session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `UserId` (`UserId`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Evaluation`
--
ALTER TABLE `Evaluation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Plate`
--
ALTER TABLE `Plate`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `Reservation`
--
ALTER TABLE `Reservation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Session`
--
ALTER TABLE `Session`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Evaluation`
--
ALTER TABLE `Evaluation`
  ADD CONSTRAINT `Evaluation_ibfk_1` FOREIGN KEY (`ReservationId`) REFERENCES `Reservation` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `Plate`
--
ALTER TABLE `Plate`
  ADD CONSTRAINT `Plate_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `Reservation`
--
ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`PlateId`) REFERENCES `Plate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `Session`
--
ALTER TABLE `Session`
  ADD CONSTRAINT `Session_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
