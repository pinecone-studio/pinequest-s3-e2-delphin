CREATE TABLE IF NOT EXISTS student_exam_attempts (
  id TEXT PRIMARY KEY NOT NULL,
  exam_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class_id TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  submitted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_student_exam_attempts_exam_student
  ON student_exam_attempts (exam_id, student_id);
