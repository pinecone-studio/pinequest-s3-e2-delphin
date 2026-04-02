INSERT OR IGNORE INTO `users` (`id`, `username`, `role`, `email`, `password`)
VALUES ('s16', 'Нандин', 'student', 'nandin@school.com', 'nandin123');

INSERT OR IGNORE INTO `student_profiles` (`user_id`, `class_id`)
VALUES ('s16', '7A');
