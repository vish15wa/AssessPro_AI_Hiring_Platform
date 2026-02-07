
export enum UserRole {
  STUDENT = 'STUDENT',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum QuestionType {
  MCQ = 'MCQ',
  SUBJECTIVE = 'SUBJECTIVE',
  CODING = 'CODING'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  contactNumber: string;
  dob: string;
  createdAt: string;
  password?: string;
}

export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: Difficulty;
  numQuestions: number;
  durationMinutes: number;
  deadline: string;
  threshold: number;
  isCodingEnabled: boolean;
  createdAt: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  marks: number;
  options?: MCQOption[];
  correctOptionId?: string;
  rubric?: string;
  initialCode?: string;
  testCases?: TestCase[];
}

export interface AssessmentAttempt {
  id: string;
  jobId: string;
  studentId: string;
  startTime: string;
  endTime?: string;
  answers: Record<string, string>; // questionId -> answer
  score: number;
  status: 'PENDING' | 'QUALIFIED' | 'DISQUALIFIED';
  suspiciousReason?: string;
  isSuspicious: boolean;
  feedback: string;
  resumeUrl?: string;
}
