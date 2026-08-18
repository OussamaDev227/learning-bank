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
  category: string
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

export interface DictionaryEntry {
  id: string
  word: string
  root: string | null
  part_of_speech: string | null
  meaning: string
  examples: string | null
  is_published: boolean
  created_at: string
}

export type LibraryResourceType = 'كتاب' | 'مقال' | 'رسالة جامعية' | 'معجم رقمي'

export interface LibraryResource {
  id: string
  title: string
  description: string | null
  author: string | null
  resource_type: LibraryResourceType
  file_url: string
  is_published: boolean
  created_at: string
}
