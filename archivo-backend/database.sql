-- ============================================
-- Script SQL para sistema de backup de formularios
-- ============================================

-- Crear tabla para almacenar leads de backup
CREATE TABLE IF NOT EXISTS `form_leads_backup` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `form_identifier` VARCHAR(50) NOT NULL COMMENT 'Identificador del formulario (LOCATION)',
  `payload` JSON NOT NULL COMMENT 'Datos completos del formulario en JSON',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP del cliente',
  `user_agent` TEXT DEFAULT NULL COMMENT 'User agent del navegador',
  `status` ENUM('received', 'notified', 'error') DEFAULT 'received' COMMENT 'Estado del procesamiento',
  `error_message` TEXT DEFAULT NULL COMMENT 'Mensaje de error si aplica',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
  PRIMARY KEY (`id`),
  KEY `idx_form_identifier` (`form_identifier`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de backup para leads de formularios';

-- Índices adicionales para consultas frecuentes
CREATE INDEX `idx_form_status` ON `form_leads_backup` (`form_identifier`, `status`);
CREATE INDEX `idx_created_status` ON `form_leads_backup` (`created_at`, `status`);
