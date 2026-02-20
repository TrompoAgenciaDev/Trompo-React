-- Añadir columna submission_id para anti-duplicación (ejecutar una vez)
ALTER TABLE `form_leads_backup`
ADD COLUMN `submission_id` VARCHAR(64) NULL DEFAULT NULL COMMENT 'UUID del envío (frontend)' AFTER `id`,
ADD UNIQUE KEY `uk_submission_id` (`submission_id`),
ADD KEY `idx_submission_id` (`submission_id`);
