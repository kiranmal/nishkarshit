-- GENERATED from src/lib/db/schema.ts by `npm run db:schema` — do not edit by hand.
-- Safe to run repeatedly (CREATE TABLE IF NOT EXISTS). Requires MySQL 5.7+/8 or MariaDB 10.5+ (JSON columns).

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NULL,
  `passwordHash` VARCHAR(255) NULL,
  `role` VARCHAR(32) NULL,
  `name` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seo_meta` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `pageSlug` VARCHAR(191) NULL,
  `title` VARCHAR(500) NULL,
  `description` TEXT NULL,
  `ogImage` TEXT NULL,
  `keywords` TEXT NULL,
  `canonicalUrl` TEXT NULL,
  `ogTitle` VARCHAR(500) NULL,
  `ogDescription` TEXT NULL,
  `twitterTitle` VARCHAR(500) NULL,
  `twitterDescription` TEXT NULL,
  `twitterImage` TEXT NULL,
  `noIndex` TINYINT(1) NULL,
  `noFollow` TINYINT(1) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_pageSlug` (`pageSlug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_content` (
  `id` VARCHAR(191) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `data` JSON NULL,
  `updatedAt` DATETIME(3) NULL,
  `updatedBy` VARCHAR(255) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cms_meta` (
  `id` VARCHAR(191) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `at` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `counters` (
  `id` VARCHAR(191) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `seq` BIGINT NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `homepage_sections` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(100) NULL,
  `label` VARCHAR(255) NULL,
  `visible` TINYINT(1) NULL,
  `order` INT NULL,
  `heading` TEXT NULL,
  `description` TEXT NULL,
  `image` TEXT NULL,
  `buttonLabel` VARCHAR(255) NULL,
  `buttonHref` TEXT NULL,
  `data` JSON NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cms_pages` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `pageKey` VARCHAR(191) NULL,
  `kind` VARCHAR(32) NULL,
  `slug` VARCHAR(191) NULL,
  `label` VARCHAR(255) NULL,
  `title` VARCHAR(500) NULL,
  `path` VARCHAR(500) NULL,
  `status` VARCHAR(16) NULL,
  `order` INT NULL,
  `spacing` VARCHAR(4) NULL,
  `hero` JSON NULL,
  `heroImage` TEXT NULL,
  `sections` JSON NULL,
  `seo` JSON NULL,
  `source` VARCHAR(16) NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_pageKey` (`pageKey`),
  KEY `ix_kind_order` (`kind`, `order`),
  KEY `ix_kind_slug` (`kind`, `slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NULL,
  `slug` VARCHAR(191) NULL,
  `author` VARCHAR(255) NULL,
  `tagline` TEXT NULL,
  `bannerImage` TEXT NULL,
  `content` LONGTEXT NULL,
  `tags` JSON NULL,
  `featured` TINYINT(1) NULL,
  `status` VARCHAR(16) NULL,
  `publishedAt` DATETIME(3) NULL,
  `previousSlugs` JSON NULL,
  `seo` JSON NULL,
  `source` VARCHAR(16) NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`),
  KEY `ix_status_publishedAt` (`status`, `publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `hardware_products` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(191) NULL,
  `name` VARCHAR(500) NULL,
  `description` TEXT NULL,
  `image` TEXT NULL,
  `images` JSON NULL,
  `unitPrice` VARCHAR(64) NULL,
  `formFields` JSON NULL,
  `terms` TEXT NULL,
  `status` VARCHAR(16) NULL,
  `order` INT NULL,
  `previousSlugs` JSON NULL,
  `seo` JSON NULL,
  `source` VARCHAR(16) NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`),
  KEY `ix_status_order` (`status`, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expertise_items` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(191) NULL,
  `order` INT NULL,
  `title` VARCHAR(500) NULL,
  `paragraph` LONGTEXT NULL,
  `accent` VARCHAR(32) NULL,
  `image` TEXT NULL,
  `introImage` TEXT NULL,
  `sections` JSON NULL,
  `formTitle` VARCHAR(500) NULL,
  `formOptions` JSON NULL,
  `seo` JSON NULL,
  `source` VARCHAR(16) NULL,
  `status` VARCHAR(16) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`),
  KEY `ix_status_order` (`status`, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_sections` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(191) NULL,
  `order` INT NULL,
  `label` VARCHAR(255) NULL,
  `heading` VARCHAR(500) NULL,
  `paragraph` LONGTEXT NULL,
  `ctaLabel` VARCHAR(255) NULL,
  `ctaHref` TEXT NULL,
  `imageSide` VARCHAR(8) NULL,
  `imageUrl` TEXT NULL,
  `accent` VARCHAR(32) NULL,
  `status` VARCHAR(16) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`),
  KEY `ix_status_order` (`status`, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `management_team` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `slug` VARCHAR(191) NULL,
  `role` VARCHAR(255) NULL,
  `image` TEXT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `linkedin` TEXT NULL,
  `section` VARCHAR(32) NULL,
  `order` INT NULL,
  `active` TINYINT(1) NULL,
  `source` VARCHAR(16) NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`),
  KEY `ix_section_order` (`section`, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `url` TEXT NULL,
  `publicId` VARCHAR(500) NULL,
  `filename` VARCHAR(500) NULL,
  `alt` VARCHAR(500) NULL,
  `title` VARCHAR(500) NULL,
  `mimeType` VARCHAR(128) NULL,
  `bytes` BIGINT NULL,
  `width` INT NULL,
  `height` INT NULL,
  `folder` VARCHAR(255) NULL,
  `uploadedBy` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `form_submissions` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `formType` VARCHAR(191) NULL,
  `formLabel` VARCHAR(255) NULL,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NULL,
  `data` JSON NULL,
  `sourceUrl` TEXT NULL,
  `ip` VARCHAR(64) NULL,
  `userAgent` TEXT NULL,
  `crmStatus` VARCHAR(32) NULL,
  `adminNotes` TEXT NULL,
  `updatedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_formType_createdAt` (`formType`, `createdAt`),
  KEY `ix_crmStatus` (`crmStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `source` VARCHAR(64) NULL,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NULL,
  `message` LONGTEXT NULL,
  `createdAt` DATETIME(3) NULL,
  `status` VARCHAR(32) NULL,
  `crmStatus` VARCHAR(32) NULL,
  `adminNotes` TEXT NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_createdAt` (`createdAt`),
  KEY `ix_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_postings` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NULL,
  `location` VARCHAR(255) NULL,
  `type` VARCHAR(64) NULL,
  `postedAt` DATETIME(3) NULL,
  `description` LONGTEXT NULL,
  `status` VARCHAR(16) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_status_postedAt` (`status`, `postedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `jobTitle` VARCHAR(500) NULL,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NULL,
  `message` LONGTEXT NULL,
  `resumeNote` TEXT NULL,
  `createdAt` DATETIME(3) NULL,
  `status` VARCHAR(32) NULL,
  `crmStatus` VARCHAR(32) NULL,
  `adminNotes` TEXT NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `partner_applications` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) NULL,
  `businessName` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NULL,
  `businessCategory` VARCHAR(255) NULL,
  `notes` LONGTEXT NULL,
  `createdAt` DATETIME(3) NULL,
  `status` VARCHAR(32) NULL,
  `crmStatus` VARCHAR(32) NULL,
  `adminNotes` TEXT NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bank_csp_applications` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) NULL,
  `fatherOrSpouseName` VARCHAR(255) NULL,
  `dob` VARCHAR(32) NULL,
  `gender` VARCHAR(32) NULL,
  `phone` VARCHAR(64) NULL,
  `email` VARCHAR(255) NULL,
  `address` TEXT NULL,
  `createdAt` DATETIME(3) NULL,
  `status` VARCHAR(32) NULL,
  `crmStatus` VARCHAR(32) NULL,
  `adminNotes` TEXT NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admission_applications` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `applicationNumber` VARCHAR(64) NULL,
  `status` VARCHAR(32) NULL,
  `crmStatus` VARCHAR(32) NULL,
  `adminNotes` TEXT NULL,
  `personal` JSON NULL,
  `education` JSON NULL,
  `loan` JSON NULL,
  `additional` JSON NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_applicationNumber` (`applicationNumber`),
  KEY `ix_createdAt` (`createdAt`),
  KEY `ix_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `loan_applications` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `applicationNumber` VARCHAR(64) NULL,
  `status` VARCHAR(32) NULL,
  `crmStatus` VARCHAR(32) NULL,
  `adminNotes` TEXT NULL,
  `personal` JSON NULL,
  `education` JSON NULL,
  `loan` JSON NULL,
  `additional` JSON NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_applicationNumber` (`applicationNumber`),
  KEY `ix_createdAt` (`createdAt`),
  KEY `ix_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `festivals` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `slug` VARCHAR(191) NULL,
  `startDate` DATETIME(3) NULL,
  `endDate` DATETIME(3) NULL,
  `active` TINYINT(1) NULL,
  `bannerText` TEXT NULL,
  `background` TEXT NULL,
  `primaryColor` VARCHAR(64) NULL,
  `accentColor` VARCHAR(64) NULL,
  `decoration` VARCHAR(32) NULL,
  `popupText` TEXT NULL,
  `popupImage` TEXT NULL,
  `priority` INT NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_theme` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(64) NULL,
  `enabled` TINYINT(1) NULL,
  `presetName` VARCHAR(255) NULL,
  `primaryColor` VARCHAR(64) NULL,
  `accentColor` VARCHAR(64) NULL,
  `bannerText` TEXT NULL,
  `decoration` VARCHAR(32) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `directory_listings` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `slug` VARCHAR(191) NULL,
  `category` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL,
  `address` TEXT NULL,
  `phone` VARCHAR(64) NULL,
  `whatsapp` VARCHAR(64) NULL,
  `email` VARCHAR(255) NULL,
  `website` TEXT NULL,
  `logoUrl` TEXT NULL,
  `logoColor` VARCHAR(32) NULL,
  `description` LONGTEXT NULL,
  `tagline` TEXT NULL,
  `whyChooseUs` JSON NULL,
  `services` JSON NULL,
  `products` JSON NULL,
  `gallery` JSON NULL,
  `videoUrl` TEXT NULL,
  `latitude` DOUBLE NULL,
  `longitude` DOUBLE NULL,
  `mapUrl` TEXT NULL,
  `hours` JSON NULL,
  `reviews` JSON NULL,
  `rating` DOUBLE NULL,
  `plan` VARCHAR(16) NULL,
  `status` VARCHAR(16) NULL,
  `metaTitle` VARCHAR(500) NULL,
  `metaDescription` TEXT NULL,
  `metaKeywords` TEXT NULL,
  `createdAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`),
  KEY `ix_status` (`status`),
  KEY `ix_category` (`category`),
  KEY `ix_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `directory_categories` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `icon` VARCHAR(32) NULL,
  `order` INT NULL,
  `status` VARCHAR(16) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_status_order` (`status`, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `directory_blogs` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NULL,
  `excerpt` TEXT NULL,
  `coverColor` VARCHAR(64) NULL,
  `slug` VARCHAR(191) NULL,
  `publishedAt` DATETIME(3) NULL,
  `status` VARCHAR(16) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  UNIQUE KEY `uq_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `directory_customers` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(191) NULL,
  `mobile` VARCHAR(64) NULL,
  `address` TEXT NULL,
  `passwordHash` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `directory_clients` (
  `id` VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `row_seq` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(191) NULL,
  `passwordHash` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NULL,
  `extra` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_row_seq` (`row_seq`),
  KEY `ix_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
