-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Jul 2025 pada 08.40
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 8.2.0

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
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action`, `description`, `created_at`) VALUES
(112, 1, 'DELETE', 'User telah dihapus: Ari Eka', '2025-05-19 08:10:46'),
(113, 1, 'INSERT', 'User baru telah ditambahkan: Arieka Prianda', '2025-05-25 01:48:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin123');

-- --------------------------------------------------------

--
-- Struktur dari tabel `attendances`
--

CREATE TABLE `attendances` (
  `attendance_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` enum('present','absent','leave','late') DEFAULT 'present',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `audit_logs`
--

CREATE TABLE `audit_logs` (
  `audit_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` text DEFAULT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `auto_replies`
--

CREATE TABLE `auto_replies` (
  `reply_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `context` enum('product','property','kiosk','football_field','general') NOT NULL,
  `reply_message` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `banners`
--

CREATE TABLE `banners` (
  `banner_id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `position` enum('homepage','promo','sidebar') DEFAULT 'homepage',
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `businessunits`
--

CREATE TABLE `businessunits` (
  `unit_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Trigger `businessunits`
--
DELIMITER $$
CREATE TRIGGER `tr_businessunits_after_insert` AFTER INSERT ON `businessunits` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.manager_id, 'INSERT', CONCAT('Unit bisnis baru telah dibuat: ', NEW.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_businessunits_after_update` AFTER UPDATE ON `businessunits` FOR EACH ROW IF NEW.manager_id != OLD.manager_id THEN
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (NEW.manager_id, 'UPDATE', CONCAT('Manager unit bisnis ', NEW.name, ' telah diubah'), NOW());
    END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `conversations`
--

CREATE TABLE `conversations` (
  `conversation_id` int(11) NOT NULL,
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `couriers`
--

CREATE TABLE `couriers` (
  `courier_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `service_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `faqs`
--

CREATE TABLE `faqs` (
  `faq_id` int(11) NOT NULL,
  `question` text DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kegiatan_kelompok`
--

CREATE TABLE `kegiatan_kelompok` (
  `id_kegiatan` bigint(20) UNSIGNED NOT NULL,
  `judul_kegiatan` varchar(255) NOT NULL,
  `tanggal_kegiatan` date NOT NULL,
  `lokasi_kegiatan` varchar(255) NOT NULL,
  `deskripsi_kegiatan` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `leave_requests`
--

CREATE TABLE `leave_requests` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `leave_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `merchants`
--

CREATE TABLE `merchants` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `merchant_type` enum('individual','company') DEFAULT 'individual',
  `national_id_number` varchar(50) NOT NULL,
  `id_card_photo` varchar(255) NOT NULL,
  `selfie_with_id_photo` varchar(255) DEFAULT NULL,
  `id_card_issued_date` date DEFAULT NULL,
  `id_card_expiry_date` date DEFAULT NULL,
  `business_name` varchar(255) NOT NULL,
  `business_address` text NOT NULL,
  `business_license` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_registration_number` varchar(100) DEFAULT NULL,
  `tax_id` varchar(100) NOT NULL,
  `bank_account_name` varchar(255) DEFAULT NULL,
  `bank_account_number` varchar(100) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `verification_status` enum('pending','approved','rejected','suspended') DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `kyc_submitted_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `merchant_profiles`
--

CREATE TABLE `merchant_profiles` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `store_name` varchar(100) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `open_hour` varchar(20) DEFAULT NULL,
  `close_hour` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_status_logs`
--

CREATE TABLE `order_status_logs` (
  `log_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `status` enum('pending','paid','shipped','delivered','cancelled') DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `changed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'email'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens_email`
--

CREATE TABLE `password_reset_tokens_email` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `status` enum('pending','verified','failed') DEFAULT NULL,
  `proof_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `payment_methods`
--

CREATE TABLE `payment_methods` (
  `method_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `type` enum('transfer','e-wallet','QRIS','cash') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `prestasi_kades`
--

CREATE TABLE `prestasi_kades` (
  `id_prestasi` bigint(20) UNSIGNED NOT NULL,
  `judul` varchar(50) NOT NULL,
  `deskripsi` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `prestasi_kades`
--

INSERT INTO `prestasi_kades` (`id_prestasi`, `judul`, `deskripsi`, `icon`, `created_at`, `updated_at`) VALUES
(0, '164', 'Budi', NULL, '2025-06-25 00:05:35', '2025-06-25 00:05:35'),
(5, '776', 'Pembangunan Jalan', NULL, '2025-06-24 23:11:19', '2025-06-24 23:11:19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `status` enum('active','inactive','discontinued') DEFAULT 'active',
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_reviews`
--

CREATE TABLE `product_reviews` (
  `review_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_tags`
--

CREATE TABLE `product_tags` (
  `tag_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_tag_map`
--

CREATE TABLE `product_tag_map` (
  `product_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_variants`
--

CREATE TABLE `product_variants` (
  `variant_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_name` varchar(100) DEFAULT NULL,
  `variant_value` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `profil_bendaharas`
--

CREATE TABLE `profil_bendaharas` (
  `id_bendahara` bigint(20) UNSIGNED NOT NULL,
  `nama_bendahara` varchar(100) NOT NULL,
  `periode_bendahara` varchar(100) NOT NULL,
  `profil_singkat_bendahara` text NOT NULL,
  `pendidikan_bendahara` text DEFAULT NULL,
  `pengalaman_bendahara` text DEFAULT NULL,
  `image_bendahara` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `profil_bendaharas`
--

INSERT INTO `profil_bendaharas` (`id_bendahara`, `nama_bendahara`, `periode_bendahara`, `profil_singkat_bendahara`, `pendidikan_bendahara`, `pengalaman_bendahara`, `image_bendahara`, `created_at`, `updated_at`) VALUES
(7, 'cccccc', 'ccc', 'cc', 'cc', 'cc', 'storage/bendahara/374ea768cb6a60d3b86020fd6cb362f0.png', '2025-06-24 20:16:41', '2025-06-24 20:16:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `profil_kades`
--

CREATE TABLE `profil_kades` (
  `id_kades` bigint(20) UNSIGNED NOT NULL,
  `image_kades` text NOT NULL,
  `nama_kades` varchar(100) NOT NULL,
  `periode_kades` varchar(100) NOT NULL,
  `profil_singkat_kades` text NOT NULL,
  `pendidikan_kades` text DEFAULT NULL,
  `pengalaman_kades` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `profil_sekdes`
--

CREATE TABLE `profil_sekdes` (
  `id_sekdes` bigint(20) UNSIGNED NOT NULL,
  `nama_sekdes` varchar(100) NOT NULL,
  `periode_sekdes` varchar(100) NOT NULL,
  `profil_singkat_sekdes` text NOT NULL,
  `pendidikan_sekdes` text DEFAULT NULL,
  `pengalaman_sekdes` text DEFAULT NULL,
  `image_sekdes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `profil_sekdes`
--

INSERT INTO `profil_sekdes` (`id_sekdes`, `nama_sekdes`, `periode_sekdes`, `profil_singkat_sekdes`, `pendidikan_sekdes`, `pengalaman_sekdes`, `image_sekdes`, `created_at`, `updated_at`) VALUES
(1, 'ccccc', 'ff', 'ss', 'ss', 'ss', 'storage/sekdes/ee0b54d2bb8cf2580a29b9ed80d8692b.png', '2025-06-24 21:30:48', '2025-06-24 21:30:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `program_kerja_kades`
--

CREATE TABLE `program_kerja_kades` (
  `id_program_kades` int(10) UNSIGNED NOT NULL,
  `judul_program_kades` varchar(125) NOT NULL,
  `text_program_kades` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `program_kerja_lembaga`
--

CREATE TABLE `program_kerja_lembaga` (
  `id_program` bigint(20) UNSIGNED NOT NULL,
  `judul_program` varchar(100) NOT NULL,
  `jadwal_program` varchar(100) NOT NULL,
  `location_program` varchar(100) NOT NULL,
  `text_program` text NOT NULL,
  `collab_program` enum('Bersama PKK','Bersama Karang Taruna') NOT NULL,
  `image_program` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `program_kerja_lembaga`
--

INSERT INTO `program_kerja_lembaga` (`id_program`, `judul_program`, `jadwal_program`, `location_program`, `text_program`, `collab_program`, `image_program`, `created_at`, `updated_at`) VALUES
(31, 'c', 'ccccc', 'dddddddd', 'ddddddd', 'Bersama PKK', 'images/programs/1750393799_6854e3c76df1c.PNG', '2025-06-19 21:29:59', '2025-06-19 21:29:59'),
(33, 'lorem ipsum', 'Selasa, 11 Maret 2024', 'Greenland', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam posuere posuere viverra. Vestibulum quis risus et turpis semper efficitur in non mi. Ut nec leo et odio mollis dictum. Vivamus nec nunc in libero feugiat ultrices eu sit amet nulla. Donec ornare non orci eget bibendum. Nulla facilisi. Proin at metus quis lacus pellentesque euismod. Phasellus nunc purus, efficitur nec tortor eu, imperdiet eleifend ligula. Vestibulum efficitur porttitor dictum. Cras convallis mauris ut ipsum iaculis, in iaculis magna mollis. Suspendisse metus tellus, sagittis sit amet leo non, maximus ultricies ex. In non dolor neque. Ut dignissim quam et molestie sagittis. Pellentesque quis interdum metus. Ut ut laoreet arcu, a aliquam sem.\r\n\r\nAliquam accumsan arcu vitae neque auctor, et lacinia ex volutpat. Aenean vitae feugiat dui. Aenean malesuada semper blandit. Proin ultrices magna ac vehicula vehicula. Suspendisse sem metus, dignissim vitae efficitur at, pulvinar sit amet enim. Etiam et lorem id justo vehicula dapibus quis vel tellus. Aliquam posuere nisi eget gravida venenatis. Nunc eget nibh id odio mollis ultricies id ac enim. Cras varius sollicitudin elit eu pretium. In hac habitasse platea dictumst. Vestibulum egestas turpis odio, eu lobortis lacus molestie quis. Morbi tincidunt luctus fermentum. Integer in mollis sapien. Phasellus ultricies elit a sem efficitur, eget efficitur dolor accumsan. Nam at est eget leo ultricies tincidunt.\r\n\r\nFusce porttitor risus quis purus dignissim, tristique faucibus ipsum ultrices. Phasellus ac finibus tortor. Vivamus consequat arcu ullamcorper, auctor odio et, accumsan purus. Sed et ipsum sit amet ex luctus accumsan id quis sapien. Aenean elit leo, accumsan nec diam semper, interdum convallis lorem. Aenean dui quam, rhoncus imperdiet dapibus et, hendrerit in dolor. Integer lorem ante, luctus a ornare quis, aliquet ut diam. Sed ultricies sed odio id semper. Fusce et ipsum at dui semper aliquam. Phasellus eget dapibus orci. Etiam sed sapien leo. Morbi iaculis dictum mi vel pharetra. Nam turpis massa, tristique sed porttitor in, scelerisque vitae tortor. Sed porta luctus neque et dignissim. Sed faucibus nibh sed metus porta bibendum ac vel purus.\r\n\r\nQuisque magna purus, placerat nec nisi ac, euismod vulputate leo. Suspendisse id neque ac massa ultrices feugiat eget non nibh. Nulla facilisi. Quisque non lacinia libero. Phasellus sit amet est sed purus commodo fringilla at a est. Nulla non molestie nulla, sed tincidunt est. Phasellus risus urna, vulputate eget vehicula et, mattis quis ipsum. Fusce ut odio efficitur, posuere metus et, scelerisque dui. Aenean vehicula quam et semper auctor. Morbi tempus orci at lorem venenatis, in egestas ligula vulputate.\r\n\r\nUt in posuere lacus, sed volutpat massa. Vivamus vitae euismod mi. Aliquam eget condimentum odio, vitae molestie ipsum. Donec maximus diam elit, eu semper tellus tempor nec. Donec eget ligula in tellus viverra eleifend. Nullam cursus leo vitae egestas scelerisque. Curabitur sed eros ipsum. Proin scelerisque porttitor augue quis maximus. Praesent in ex odio. Cras sit amet lacus sed urna ullamcorper elementum. Nam sit amet porta dolor. Integer non elit eu ex dapibus luctus.', 'Bersama Karang Taruna', 'images/programs/1750407589_685519a597772.jpeg', '2025-06-20 01:19:49', '2025-06-20 01:19:49');

-- --------------------------------------------------------

--
-- Struktur dari tabel `properties`
--

CREATE TABLE `properties` (
  `property_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `location` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `status` enum('available','rented','maintenance') DEFAULT 'available',
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Trigger `properties`
--
DELIMITER $$
CREATE TRIGGER `tr_properties_after_insert` AFTER INSERT ON `properties` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
(user_id, action, description, created_at)
VALUES 
(NEW.unit_id, 'INSERT', CONCAT('Properti baru telah ditambahkan: ', NEW.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_properties_before_delete` BEFORE DELETE ON `properties` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (1, 'DELETE', CONCAT('Properti telah dihapus: ', OLD.name), NOW())
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `public_complaints`
--

CREATE TABLE `public_complaints` (
  `complaint_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('pending','in_progress','resolved','rejected') DEFAULT 'pending',
  `response` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `responded_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `refunds`
--

CREATE TABLE `refunds` (
  `refund_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('requested','approved','rejected') DEFAULT 'requested',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `regulations`
--

CREATE TABLE `regulations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `regulation_type` enum('Peraturan Desa','Peraturan Bupati','Peraturan Daerah','Peraturan Menteri','Undang-Undang') NOT NULL,
  `regulation_number` varchar(100) NOT NULL,
  `title` text NOT NULL,
  `status` enum('berlaku','diproses') DEFAULT NULL,
  `date` date NOT NULL,
  `file_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `type` enum('financial','inventory','transaction','other') NOT NULL,
  `period` varchar(50) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Trigger `reports`
--
DELIMITER $$
CREATE TRIGGER `tr_reports_after_insert` AFTER INSERT ON `reports` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.created_by, 'INSERT', CONCAT('Laporan baru telah dibuat: ', NEW.title, ' (', NEW.type, ')'), NOW())
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `returns`
--

CREATE TABLE `returns` (
  `return_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipments`
--

CREATE TABLE `shipments` (
  `shipment_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `shipping_address_id` int(11) DEFAULT NULL,
  `courier_name` varchar(100) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `courier_service` varchar(100) DEFAULT NULL,
  `status` enum('pending','shipped','in_transit','delivered','cancelled') DEFAULT 'pending',
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `received_by_user` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `courier_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipping_addresses`
--

CREATE TABLE `shipping_addresses` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `recipient_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `post_code` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `province` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `subdistrict` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipping_rates`
--

CREATE TABLE `shipping_rates` (
  `rate_id` int(11) NOT NULL,
  `origin_city` varchar(100) DEFAULT NULL,
  `destination_city` varchar(100) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `courier_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_alat_olahraga`
--

CREATE TABLE `tb_alat_olahraga` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_barang` varchar(100) DEFAULT NULL,
  `jumlah` int(11) DEFAULT NULL,
  `harga_satuan` decimal(10,2) DEFAULT NULL,
  `pendapatan` decimal(15,2) DEFAULT NULL,
  `keterangan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_ayam_petelur`
--

CREATE TABLE `tb_ayam_petelur` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `jumlah_telur` int(11) DEFAULT NULL,
  `harga_per_butir` decimal(10,2) DEFAULT NULL,
  `pendapatan` decimal(15,2) DEFAULT NULL,
  `keterangan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_ayam_petelur`
--

INSERT INTO `tb_ayam_petelur` (`id`, `tanggal`, `jumlah_telur`, `harga_per_butir`, `pendapatan`, `keterangan`) VALUES
(1, '2025-05-27', 100, '300.00', '3000.00', '100');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_perikanan`
--

CREATE TABLE `tb_perikanan` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `keterangan` varchar(100) DEFAULT NULL,
  `jumlah_ikan` int(11) DEFAULT NULL,
  `harga_per_kg` decimal(10,2) DEFAULT NULL,
  `pendapatan` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_sewa_lapangan`
--

CREATE TABLE `tb_sewa_lapangan` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_penyewa` varchar(100) DEFAULT NULL,
  `durasi_jam` int(11) DEFAULT NULL,
  `harga_per_jam` decimal(10,2) DEFAULT NULL,
  `pendapatan` decimal(15,2) DEFAULT NULL,
  `keterangan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_sewa_lapangan`
--

INSERT INTO `tb_sewa_lapangan` (`id`, `tanggal`, `nama_penyewa`, `durasi_jam`, `harga_per_jam`, `pendapatan`, `keterangan`) VALUES
(1, '2025-05-22', 'gg', 2, '250.00', '500.00', 'lunas');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_sewa_property`
--

CREATE TABLE `tb_sewa_property` (
  `id` int(11) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `nama_penyewa` varchar(100) DEFAULT NULL,
  `harga_per_bulan` decimal(15,2) DEFAULT NULL,
  `total_bulan` int(11) DEFAULT NULL,
  `pendapatan` decimal(15,2) DEFAULT NULL,
  `keterangan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tracking_logs`
--

CREATE TABLE `tracking_logs` (
  `tracking_id` int(11) NOT NULL,
  `shipment_id` int(11) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `location` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('product','property','service') NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','completed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(100) DEFAULT NULL,
  `transfer_deadline` datetime DEFAULT NULL,
  `e_wallet_name` varchar(50) DEFAULT NULL,
  `e_wallet_number` varchar(30) DEFAULT NULL,
  `payment_proof` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Trigger `transactions`
--
DELIMITER $$
CREATE TRIGGER `tr_transactions_after_update` AFTER UPDATE ON `transactions` FOR EACH ROW IF NEW.status != OLD.status THEN
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (NEW.user_id, 'UPDATE', CONCAT('Status transaksi ID:', NEW.transaction_id, ' diubah dari ', 
                                      OLD.status, ' menjadi ', NEW.status), NOW());
    END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaction_items`
--

CREATE TABLE `transaction_items` (
  `item_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `reference_id` int(11) NOT NULL,
  `type` enum('product','property') NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Trigger `transaction_items`
--
DELIMITER $$
CREATE TRIGGER `tr_transaction_items_after_insert` AFTER INSERT ON `transaction_items` FOR EACH ROW IF NEW.type = 'product' THEN
        UPDATE db_bumdes_semplak_barat.products
        SET stock = stock - NEW.quantity
        WHERE product_id = NEW.reference_id;
        
        -- Log aktivitas
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (1, 'UPDATE', CONCAT('Stok produk ID:', NEW.reference_id, ' berkurang sebanyak ', NEW.quantity), NOW());
    END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `foto_profil` varchar(255) DEFAULT NULL,
  `foto_ktp` varchar(255) DEFAULT NULL,
  `bio_users` text DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT 'Belum diisi',
  `role` enum('admin','manager','staff','customer','merchant') NOT NULL,
  `status` enum('active','verify','inactive') NOT NULL DEFAULT 'inactive',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `nomor_rekening` int(20) DEFAULT NULL,
  `kontak_darurat` int(15) DEFAULT NULL,
  `siup_nib` varchar(50) DEFAULT NULL,
  `nama_usaha` varchar(50) DEFAULT NULL,
  `jenis_produk_layanan` varchar(50) DEFAULT NULL,
  `alamat_usaha` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `user_id`, `name`, `username`, `email`, `google_id`, `phone`, `foto_profil`, `foto_ktp`, `bio_users`, `tanggal_lahir`, `jenis_kelamin`, `password`, `address`, `role`, `status`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`, `nomor_rekening`, `kontak_darurat`, `siup_nib`, `nama_usaha`, `jenis_produk_layanan`, `alamat_usaha`) VALUES
(56, NULL, 'Penjual Baru', 'penjual', 'ariekaprianda@email.com', NULL, '08816818087', NULL, NULL, NULL, NULL, NULL, '$2b$10$03fpDNx4/.ReQPhwGWvNaO15ZRQGSD7n8QqYHkua4GNJHgkZwB3Qy', 'Jl. Semplak Barat No. 1', 'merchant', 'active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, NULL, 'rudi', 'rudi1', 'mjubaesilah@gmail.com', NULL, NULL, NULL, NULL, NULL, '2007-07-19', 'Laki-laki', '$2b$10$K/DVVa8oYuOWySYJKAohxu8E.hXKsdYzl5J6kpdn8A1bPXXpi1CTm', 'Belum diisi', 'customer', 'inactive', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users_backup`
--

CREATE TABLE `users_backup` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(255) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `admin_type` enum('super','sdm','business','tech') DEFAULT NULL,
  `status` enum('active','verify','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inactive',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `method` varchar(50) DEFAULT NULL,
  `year_joined` int(4) NOT NULL DEFAULT 2025,
  `role_id` int(11) DEFAULT NULL,
  `is_2fa_enabled` tinyint(1) DEFAULT 0,
  `two_fa_secret` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users_backup`
--

INSERT INTO `users_backup` (`user_id`, `name`, `username`, `gender`, `date_of_birth`, `email`, `google_id`, `password`, `phone`, `profile_picture`, `address`, `admin_type`, `status`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`, `method`, `year_joined`, `role_id`, `is_2fa_enabled`, `two_fa_secret`) VALUES
(1, 'Arieka Prianda', '', 'male', NULL, 'ariekaprianda399@gmail.com', NULL, '', NULL, '', NULL, 'super', 'inactive', NULL, NULL, '2025-05-25 01:48:42', '2025-05-25 01:48:42', 'google', 2025, NULL, 0, NULL);

--
-- Trigger `users_backup`
--
DELIMITER $$
CREATE TRIGGER `tr_users_after_insert` AFTER INSERT ON `users_backup` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.user_id, 'INSERT', CONCAT('User baru telah ditambahkan: ', NEW.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_users_after_update` AFTER UPDATE ON `users_backup` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.user_id, 'UPDATE', CONCAT('Data user telah diperbarui: ', NEW.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_users_before_delete` BEFORE DELETE ON `users_backup` FOR EACH ROW INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (OLD.user_id, 'DELETE', CONCAT('User telah dihapus: ', OLD.name), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_users_before_insert` BEFORE INSERT ON `users_backup` FOR EACH ROW IF NEW.email NOT LIKE '%_@%_.__%' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Format email tidak valid';
    END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_logs`
--

CREATE TABLE `user_logs` (
  `id` int(11) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `device_info` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_logs`
--

INSERT INTO `user_logs` (`id`, `user_id`, `action`, `ip_address`, `device_info`, `created_at`) VALUES
(11, '43', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-04 07:35:59'),
(12, '43', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-04 08:31:14'),
(13, '43', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-04 08:41:02'),
(14, '44', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-07 02:08:58'),
(15, '45', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-07 02:29:03'),
(16, '46', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-07 07:32:42'),
(17, '46', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-08 03:40:49'),
(18, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-08 03:56:03'),
(19, '52', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 02:03:11'),
(20, '52', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 02:38:26'),
(21, '53', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 02:47:34'),
(22, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 03:18:13'),
(23, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 06:17:25'),
(24, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 07:23:17'),
(25, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 07:23:29'),
(26, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 07:23:39'),
(27, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 07:27:43'),
(28, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 07:29:06'),
(29, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 07:55:24'),
(30, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-09 08:09:49'),
(31, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 02:51:49'),
(32, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 03:00:14'),
(33, '53', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 03:30:47'),
(34, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 03:56:30'),
(35, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 04:55:28'),
(36, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 07:43:31'),
(37, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 07:49:01'),
(38, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 08:11:22'),
(39, '48', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 08:16:54'),
(40, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-10 08:18:57'),
(41, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 02:29:32'),
(42, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 02:45:58'),
(43, '54', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 03:28:43'),
(44, '52', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 04:37:26'),
(45, '56', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 06:22:50'),
(46, '55', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 07:07:27'),
(47, '56', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 07:09:09'),
(48, '56', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-11 08:48:54'),
(49, '55', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-14 02:40:14'),
(50, '55', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-14 02:45:22'),
(51, '53', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-14 02:48:55'),
(52, '55', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-14 03:12:30'),
(53, '53', 'login', '::ffff:127.0.0.1', 'Dart/3.8 (dart:io)', '2025-07-14 04:11:09');

-- --------------------------------------------------------

--
-- Struktur dari tabel `verifications`
--

CREATE TABLE `verifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` enum('email','sms','whatsapp') NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `verifications`
--

INSERT INTO `verifications` (`id`, `identifier`, `code`, `type`, `expires_at`, `created_at`, `updated_at`) VALUES
(158, 'mjubaesilah@gmail.com', '869564', 'email', '2025-07-08 03:59:19', NULL, NULL),
(171, '628816818032', '485131', 'whatsapp', '2025-07-09 01:56:39', NULL, NULL),
(172, 'mjubeasilah@gmail.com', '842428', 'email', '2025-07-09 02:49:59', NULL, NULL),
(173, 'ariekaprianda@gmail.com', '172726', 'email', '2025-07-09 07:27:09', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `vouchers`
--

CREATE TABLE `vouchers` (
  `voucher_id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percentage','fixed') DEFAULT NULL,
  `value` decimal(10,2) DEFAULT NULL,
  `min_order` decimal(10,2) DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `usage_limit` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `whatsapp_otps`
--

CREATE TABLE `whatsapp_otps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `wishlists`
--

CREATE TABLE `wishlists` (
  `wishlist_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `work_logs`
--

CREATE TABLE `work_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `activity` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`audit_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `auto_replies`
--
ALTER TABLE `auto_replies`
  ADD PRIMARY KEY (`reply_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`banner_id`);

--
-- Indeks untuk tabel `businessunits`
--
ALTER TABLE `businessunits`
  ADD PRIMARY KEY (`unit_id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indeks untuk tabel `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`conversation_id`),
  ADD KEY `user_one_id` (`user_one_id`),
  ADD KEY `user_two_id` (`user_two_id`);

--
-- Indeks untuk tabel `couriers`
--
ALTER TABLE `couriers`
  ADD PRIMARY KEY (`courier_id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`faq_id`);

--
-- Indeks untuk tabel `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kegiatan_kelompok`
--
ALTER TABLE `kegiatan_kelompok`
  ADD PRIMARY KEY (`id_kegiatan`);

--
-- Indeks untuk tabel `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `merchants`
--
ALTER TABLE `merchants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `verification_status` (`verification_status`),
  ADD KEY `is_active` (`is_active`);

--
-- Indeks untuk tabel `merchant_profiles`
--
ALTER TABLE `merchant_profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `order_status_logs`
--
ALTER TABLE `order_status_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_reset_tokens_email`
--
ALTER TABLE `password_reset_tokens_email`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indeks untuk tabel `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`method_id`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indeks untuk tabel `prestasi_kades`
--
ALTER TABLE `prestasi_kades`
  ADD PRIMARY KEY (`id_prestasi`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `unit_id` (`unit_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `product_tags`
--
ALTER TABLE `product_tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `product_tag_map`
--
ALTER TABLE `product_tag_map`
  ADD PRIMARY KEY (`product_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indeks untuk tabel `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `profil_bendaharas`
--
ALTER TABLE `profil_bendaharas`
  ADD PRIMARY KEY (`id_bendahara`);

--
-- Indeks untuk tabel `profil_kades`
--
ALTER TABLE `profil_kades`
  ADD PRIMARY KEY (`id_kades`);

--
-- Indeks untuk tabel `profil_sekdes`
--
ALTER TABLE `profil_sekdes`
  ADD PRIMARY KEY (`id_sekdes`);

--
-- Indeks untuk tabel `program_kerja_kades`
--
ALTER TABLE `program_kerja_kades`
  ADD PRIMARY KEY (`id_program_kades`);

--
-- Indeks untuk tabel `program_kerja_lembaga`
--
ALTER TABLE `program_kerja_lembaga`
  ADD PRIMARY KEY (`id_program`);

--
-- Indeks untuk tabel `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`property_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indeks untuk tabel `public_complaints`
--
ALTER TABLE `public_complaints`
  ADD PRIMARY KEY (`complaint_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`refund_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `regulations`
--
ALTER TABLE `regulations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `unit_id` (`unit_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indeks untuk tabel `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`return_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indeks untuk tabel `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`shipment_id`),
  ADD UNIQUE KEY `shipping_address_id` (`shipping_address_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `courier_user_id` (`courier_user_id`);

--
-- Indeks untuk tabel `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD PRIMARY KEY (`rate_id`),
  ADD KEY `courier_id` (`courier_id`);

--
-- Indeks untuk tabel `tracking_logs`
--
ALTER TABLE `tracking_logs`
  ADD PRIMARY KEY (`tracking_id`),
  ADD KEY `shipment_id` (`shipment_id`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- Indeks untuk tabel `users_backup`
--
ALTER TABLE `users_backup`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `fk_role` (`role_id`);

--
-- Indeks untuk tabel `user_logs`
--
ALTER TABLE `user_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `verifications`
--
ALTER TABLE `verifications`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`voucher_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indeks untuk tabel `whatsapp_otps`
--
ALTER TABLE `whatsapp_otps`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `work_logs`
--
ALTER TABLE `work_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT untuk tabel `attendances`
--
ALTER TABLE `attendances`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `auto_replies`
--
ALTER TABLE `auto_replies`
  MODIFY `reply_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `banners`
--
ALTER TABLE `banners`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `businessunits`
--
ALTER TABLE `businessunits`
  MODIFY `unit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `conversations`
--
ALTER TABLE `conversations`
  MODIFY `conversation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `couriers`
--
ALTER TABLE `couriers`
  MODIFY `courier_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `faqs`
--
ALTER TABLE `faqs`
  MODIFY `faq_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kegiatan_kelompok`
--
ALTER TABLE `kegiatan_kelompok`
  MODIFY `id_kegiatan` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `merchants`
--
ALTER TABLE `merchants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `merchant_profiles`
--
ALTER TABLE `merchant_profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `order_status_logs`
--
ALTER TABLE `order_status_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `prestasi_kades`
--
ALTER TABLE `prestasi_kades`
  MODIFY `id_prestasi` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `product_tags`
--
ALTER TABLE `product_tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `profil_bendaharas`
--
ALTER TABLE `profil_bendaharas`
  MODIFY `id_bendahara` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `profil_kades`
--
ALTER TABLE `profil_kades`
  MODIFY `id_kades` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `profil_sekdes`
--
ALTER TABLE `profil_sekdes`
  MODIFY `id_sekdes` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `program_kerja_kades`
--
ALTER TABLE `program_kerja_kades`
  MODIFY `id_program_kades` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `program_kerja_lembaga`
--
ALTER TABLE `program_kerja_lembaga`
  MODIFY `id_program` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT untuk tabel `properties`
--
ALTER TABLE `properties`
  MODIFY `property_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `public_complaints`
--
ALTER TABLE `public_complaints`
  MODIFY `complaint_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `refunds`
--
ALTER TABLE `refunds`
  MODIFY `refund_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `regulations`
--
ALTER TABLE `regulations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `returns`
--
ALTER TABLE `returns`
  MODIFY `return_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `shipments`
--
ALTER TABLE `shipments`
  MODIFY `shipment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `shipping_rates`
--
ALTER TABLE `shipping_rates`
  MODIFY `rate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tracking_logs`
--
ALTER TABLE `tracking_logs`
  MODIFY `tracking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT untuk tabel `users_backup`
--
ALTER TABLE `users_backup`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `user_logs`
--
ALTER TABLE `user_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT untuk tabel `verifications`
--
ALTER TABLE `verifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT untuk tabel `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `voucher_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `wishlist_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `work_logs`
--
ALTER TABLE `work_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `auto_replies`
--
ALTER TABLE `auto_replies`
  ADD CONSTRAINT `auto_replies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `businessunits`
--
ALTER TABLE `businessunits`
  ADD CONSTRAINT `businessunits_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`user_one_id`) REFERENCES `users_backup` (`user_id`),
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`user_two_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`);

--
-- Ketidakleluasaan untuk tabel `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `merchants`
--
ALTER TABLE `merchants`
  ADD CONSTRAINT `merchants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `merchant_profiles`
--
ALTER TABLE `merchant_profiles`
  ADD CONSTRAINT `merchant_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `order_status_logs`
--
ALTER TABLE `order_status_logs`
  ADD CONSTRAINT `order_status_logs_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  ADD CONSTRAINT `order_status_logs_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`);

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `businessunits` (`unit_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Ketidakleluasaan untuk tabel `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `product_tag_map`
--
ALTER TABLE `product_tag_map`
  ADD CONSTRAINT `product_tag_map_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `product_tag_map_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `product_tags` (`tag_id`);

--
-- Ketidakleluasaan untuk tabel `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Ketidakleluasaan untuk tabel `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `businessunits` (`unit_id`);

--
-- Ketidakleluasaan untuk tabel `public_complaints`
--
ALTER TABLE `public_complaints`
  ADD CONSTRAINT `public_complaints_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `refunds`
--
ALTER TABLE `refunds`
  ADD CONSTRAINT `refunds_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  ADD CONSTRAINT `refunds_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `businessunits` (`unit_id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `returns`
--
ALTER TABLE `returns`
  ADD CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  ADD CONSTRAINT `returns_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  ADD CONSTRAINT `shipments_ibfk_2` FOREIGN KEY (`courier_user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  ADD CONSTRAINT `shipping_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD CONSTRAINT `shipping_rates_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`courier_id`);

--
-- Ketidakleluasaan untuk tabel `tracking_logs`
--
ALTER TABLE `tracking_logs`
  ADD CONSTRAINT `tracking_logs_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`shipment_id`);

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`);

--
-- Ketidakleluasaan untuk tabel `users_backup`
--
ALTER TABLE `users_backup`
  ADD CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Ketidakleluasaan untuk tabel `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`),
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Ketidakleluasaan untuk tabel `work_logs`
--
ALTER TABLE `work_logs`
  ADD CONSTRAINT `work_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_backup` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
