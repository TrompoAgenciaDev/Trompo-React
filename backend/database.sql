-- Sistema de backup de formularios
CREATE TABLE IF NOT EXISTS `form_leads_backup` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` VARCHAR(64) NULL DEFAULT NULL COMMENT 'UUID del envío (anti-duplicación)',
  `form_identifier` VARCHAR(50) NOT NULL COMMENT 'Identificador del formulario (LOCATION)',
  `payload` JSON NOT NULL COMMENT 'Datos completos del formulario en JSON',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP del cliente',
  `user_agent` TEXT DEFAULT NULL COMMENT 'User agent del navegador',
  `status` ENUM('received', 'notified', 'error') DEFAULT 'received' COMMENT 'Estado del procesamiento',
  `error_message` TEXT DEFAULT NULL COMMENT 'Mensaje de error si aplica',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_submission_id` (`submission_id`),
  KEY `idx_submission_id` (`submission_id`),
  KEY `idx_form_identifier` (`form_identifier`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de backup para leads de formularios';
