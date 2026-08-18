export type Role = 'student' | 'admin'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: Role
  avatar_url: string | null
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  order_index: number
  is_published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  order_index: number
  is_published: boolean
  created_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  completed_at: string
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  options: string[]
  correct_index: number
  order_index: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total: number
  completed_at: string
}
