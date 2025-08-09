-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 27 Bulan Mei 2025 pada 06.20
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bumdesapp_db`
--

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
(1, '2025-05-27', 100, 300.00, 3000.00, '100');

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
(1, '2025-05-22', 'gg', 2, 250.00, 500.00, 'lunas');

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
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin123'),
(2, 'desa', 'desa123');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_alat_olahraga`
--
ALTER TABLE `tb_alat_olahraga`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_ayam_petelur`
--
ALTER TABLE `tb_ayam_petelur`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_perikanan`
--
ALTER TABLE `tb_perikanan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_sewa_lapangan`
--
ALTER TABLE `tb_sewa_lapangan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_sewa_property`
--
ALTER TABLE `tb_sewa_property`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_alat_olahraga`
--
ALTER TABLE `tb_alat_olahraga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tb_ayam_petelur`
--
ALTER TABLE `tb_ayam_petelur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_perikanan`
--
ALTER TABLE `tb_perikanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tb_sewa_lapangan`
--
ALTER TABLE `tb_sewa_lapangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_sewa_property`
--
ALTER TABLE `tb_sewa_property`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
