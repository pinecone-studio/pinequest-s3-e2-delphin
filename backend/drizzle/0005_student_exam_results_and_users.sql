ALTER TABLE `users` ADD COLUMN `email` text;
ALTER TABLE `users` ADD COLUMN `password` text;
ALTER TABLE `users` ADD COLUMN `class_id` text;

CREATE TABLE IF NOT EXISTS `student_exam_results` (
  `id` text PRIMARY KEY NOT NULL,
  `exam_id` text NOT NULL,
  `student_id` text NOT NULL,
  `student_name` text NOT NULL,
  `class_id` text NOT NULL,
  `answers_json` text NOT NULL,
  `score` integer NOT NULL,
  `total_points` integer NOT NULL,
  `status` text NOT NULL,
  `submitted_at` text NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);

UPDATE `users`
SET `email` = '', `password` = '', `class_id` = ''
WHERE `email` IS NULL OR `password` IS NULL OR `class_id` IS NULL;

INSERT OR IGNORE INTO `users` (`id`, `username`, `role`, `email`, `password`, `class_id`) VALUES
  ('s1', 'Бат-Эрдэнэ', 'student', 'baterdene@school.com', 'baterdene123', '10A'),
  ('s2', 'Сарангэрэл', 'student', 'sarangerel@school.com', 'sarangerel123', '10A'),
  ('s3', 'Тэмүүлэн', 'student', 'temuulen@school.com', 'temuulen123', '10A'),
  ('s4', 'Номин', 'student', 'nomin@school.com', 'nomin123', '10A'),
  ('s5', 'Энхжин', 'student', 'enkhjin@school.com', 'enkhjin123', '10A');
