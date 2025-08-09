-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Bulan Mei 2025 pada 04.19
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bumdes_semplak_barat`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` enum('admin','user','merchant','supplier') NOT NULL,
  `status` enum('active','verify','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inactive',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Trigger `users`
--
DELIMITER $$
CREATE TRIGGER `tr_users_after_insert` AFTER INSERT ON `users` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.user_id, 'INSERT', CONCAT('User baru telah ditambahkan: ', NEW.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_users_after_update` AFTER UPDATE ON `users` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.user_id, 'UPDATE', CONCAT('Data user telah diperbarui: ', NEW.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_users_before_delete` BEFORE DELETE ON `users` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (OLD.user_id, 'DELETE', CONCAT('User telah dihapus: ', OLD.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_users_before_insert` BEFORE INSERT ON `users` FOR EACH ROW IF NEW.email NOT LIKE '%_@%_.__%' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Format email tidak valid';
    END IF
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
