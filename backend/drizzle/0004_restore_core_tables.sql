CREATE TABLE IF NOT EXISTS `users` (
  `id` text PRIMARY KEY NOT NULL,
  `username` text NOT NULL,
  `role` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `courses` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `assessments` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `duration_minutes` integer NOT NULL,
  `pass_score` integer NOT NULL,
  `attempts_allowed` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` text PRIMARY KEY NOT NULL,
  `assessment_id` text NOT NULL,
  `candidate_id` text NOT NULL,
  `status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` text PRIMARY KEY NOT NULL,
  `assignment_id` text NOT NULL,
  `status` text NOT NULL,
  `submitted_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `results` (
  `id` text PRIMARY KEY NOT NULL,
  `submission_id` text NOT NULL,
  `score` integer NOT NULL,
  `passed` integer NOT NULL
);
--> statement-breakpoint
INSERT OR IGNORE INTO `users` (`id`, `username`, `role`) VALUES
  ('u-reviewer-1', 'AAAA', 'reviewer'),
  ('u-candidate-1', 'BBBB', 'candidate');
--> statement-breakpoint
INSERT OR IGNORE INTO `courses` (`id`, `title`, `type`) VALUES
  ('course-safety', 'Workplace Safety Basics', 'training');
--> statement-breakpoint
INSERT OR IGNORE INTO `assessments` (`id`, `title`, `duration_minutes`, `pass_score`, `attempts_allowed`) VALUES
  ('assessment-1', 'Safety Fundamentals Exam', 20, 70, 1);
--> statement-breakpoint
INSERT OR IGNORE INTO `assignments` (`id`, `assessment_id`, `candidate_id`, `status`) VALUES
  ('assignment-1', 'assessment-1', 'u-candidate-1', 'assigned');
--> statement-breakpoint
INSERT OR IGNORE INTO `submissions` (`id`, `assignment_id`, `status`, `submitted_at`) VALUES
  ('submission-1', 'assignment-1', 'submitted', '2026-03-23T10:00:00Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `results` (`id`, `submission_id`, `score`, `passed`) VALUES
  ('result-1', 'submission-1', 82, 1);
