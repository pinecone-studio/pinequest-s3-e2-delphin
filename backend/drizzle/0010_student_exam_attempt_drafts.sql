ALTER TABLE student_exam_attempts
  ADD COLUMN answers_json text;

ALTER TABLE student_exam_attempts
  ADD COLUMN current_question integer;

UPDATE student_exam_attempts
SET answers_json = COALESCE(answers_json, '{}'),
    current_question = COALESCE(current_question, 0);
