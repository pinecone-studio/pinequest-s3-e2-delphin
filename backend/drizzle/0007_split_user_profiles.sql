CREATE TABLE IF NOT EXISTS `student_profiles` (
  `user_id` text PRIMARY KEY NOT NULL,
  `class_id` text NOT NULL
);

CREATE TABLE IF NOT EXISTS `teacher_profiles` (
  `user_id` text PRIMARY KEY NOT NULL,
  `subject` text NOT NULL
);

INSERT OR IGNORE INTO `student_profiles` (`user_id`, `class_id`)
SELECT `id`, `class_id`
FROM `users`
WHERE `role` = 'student' AND `class_id` IS NOT NULL AND `class_id` != '';

INSERT OR IGNORE INTO `users` (`id`, `username`, `role`, `email`, `password`, `class_id`) VALUES
  ('teacher1', 'Амарбаясгалан', 'teacher', 'amarbaysgalan@school.com', 'amarbaysgalan123', '');

INSERT OR IGNORE INTO `teacher_profiles` (`user_id`, `subject`) VALUES
  ('teacher1', 'Математик');
