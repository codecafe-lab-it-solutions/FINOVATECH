-- Run this once in MySQL Workbench (connected as root / an admin user).
-- Creates a dedicated database + a scoped app user for the FINOVATECH backend.
-- This user can ONLY touch the `finovatech` database — not your other schemas.

CREATE DATABASE IF NOT EXISTS finovatech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE USER IF NOT EXISTS 'finovatech_app'@'localhost'
  IDENTIFIED BY 'EYAdKLsAocxITKNqEyF3Tdl';

GRANT ALL PRIVILEGES ON finovatech.* TO 'finovatech_app'@'localhost';

FLUSH PRIVILEGES;
