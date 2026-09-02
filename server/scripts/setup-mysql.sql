-- Run this once in MySQL Workbench (connected as root / an admin user).
-- Creates a dedicated database + a scoped app user for the FINOVATECK backend.
-- This user can ONLY touch the `finovateck` database — not your other schemas.

CREATE DATABASE IF NOT EXISTS finovateck
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE USER IF NOT EXISTS 'finovateck_app'@'localhost'
  IDENTIFIED BY 'EYAdKLsAocxITKNqEyF3Tdl';

GRANT ALL PRIVILEGES ON finovateck.* TO 'finovateck_app'@'localhost';

FLUSH PRIVILEGES;
