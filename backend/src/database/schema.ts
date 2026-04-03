import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  role: text('role').notNull(),
  email: text('email'),
  password: text('password'),
});

export const studentProfiles = sqliteTable('student_profiles', {
  userId: text('user_id').primaryKey(),
  classId: text('class_id').notNull(),
});

export const teacherProfiles = sqliteTable('teacher_profiles', {
  userId: text('user_id').primaryKey(),
  subject: text('subject').notNull(),
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(),
});

export const assessments = sqliteTable('assessments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  passScore: integer('pass_score').notNull(),
  attemptsAllowed: integer('attempts_allowed').notNull(),
});

export const exams = sqliteTable('exams', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  reportReleaseMode: text('report_release_mode').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const examQuestions = sqliteTable('exam_questions', {
  id: text('id').primaryKey(),
  examId: text('exam_id').notNull(),
  type: text('type').notNull(),
  prompt: text('prompt').notNull(),
  optionsJson: text('options_json'),
  correctAnswer: text('correct_answer'),
  iconKey: text('icon_key'),
  points: integer('points').notNull(),
  displayOrder: integer('display_order').notNull(),
});

export const examSchedules = sqliteTable('exam_schedules', {
  id: text('id').primaryKey(),
  examId: text('exam_id').notNull(),
  classId: text('class_id').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
});

export const assignments = sqliteTable('assignments', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').notNull(),
  candidateId: text('candidate_id').notNull(),
  status: text('status').notNull(),
});

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  assignmentId: text('assignment_id').notNull(),
  status: text('status').notNull(),
  submittedAt: text('submitted_at').notNull(),
});

export const results = sqliteTable('results', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull(),
  score: integer('score').notNull(),
  passed: integer('passed', { mode: 'boolean' }).notNull(),
});

export const studentExamResults = sqliteTable('student_exam_results', {
  id: text('id').primaryKey(),
  examId: text('exam_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  classId: text('class_id').notNull(),
  answersJson: text('answers_json').notNull(),
  score: integer('score').notNull(),
  totalPoints: integer('total_points').notNull(),
  status: text('status').notNull(),
  submittedAt: text('submitted_at').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const studentExamAttempts = sqliteTable('student_exam_attempts', {
  id: text('id').primaryKey(),
  examId: text('exam_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  classId: text('class_id').notNull(),
  status: text('status').notNull(),
  answersJson: text('answers_json'),
  currentQuestion: integer('current_question'),
  answeredCount: integer('answered_count').notNull().default(0),
  startedAt: text('started_at').notNull(),
  submittedAt: text('submitted_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const uploadedFiles = sqliteTable('uploaded_files', {
  id: text('id').primaryKey(),
  bucket: text('bucket').notNull(),
  key: text('key').notNull(),
  folder: text('folder').notNull(),
  originalName: text('original_name').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  uploadedAt: text('uploaded_at').notNull(),
});
