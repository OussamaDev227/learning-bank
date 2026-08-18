import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { AppLayout } from './components/layout/AppLayout'
import { RequireRole } from './components/RequireRole'
import { Home } from './routes/Home'
import { Login } from './routes/Login'
import { Register } from './routes/Register'
import { Profile } from './routes/Profile'
import { CourseList } from './routes/learn/CourseList'
import { CourseDetail } from './routes/learn/CourseDetail'
import { LessonView } from './routes/learn/LessonView'
import { QuizPlayer } from './routes/learn/QuizPlayer'
import { BankCourses } from './routes/banks/BankCourses'
import { DictionarySearch } from './routes/DictionarySearch'
import { AdminLayout } from './routes/admin/AdminLayout'
import { AdminOverview } from './routes/admin/AdminOverview'
import { CoursesManager } from './routes/admin/CoursesManager'
import { LessonsManager } from './routes/admin/LessonsManager'
import { QuizzesManager } from './routes/admin/QuizzesManager'
import { UsersManager } from './routes/admin/UsersManager'
import { DictionaryManager } from './routes/admin/DictionaryManager'
import { Library } from './routes/Library'
import { LibraryManager } from './routes/admin/LibraryManager'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />

          <Route path="/learn" element={<AppLayout><CourseList /></AppLayout>} />
          <Route path="/learn/:courseId" element={<AppLayout><CourseDetail /></AppLayout>} />
          <Route
            path="/learn/:courseId/:lessonId"
            element={<AppLayout><LessonView /></AppLayout>}
          />
          <Route
            path="/learn/:courseId/:lessonId/quiz"
            element={<AppLayout><QuizPlayer /></AppLayout>}
          />
          <Route path="/banks/:slug" element={<AppLayout><BankCourses /></AppLayout>} />
          <Route path="/dictionary" element={<AppLayout><DictionarySearch /></AppLayout>} />
          <Route path="/library" element={<AppLayout><Library /></AppLayout>} />

          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="courses" element={<CoursesManager />} />
            <Route path="courses/:courseId/lessons" element={<LessonsManager />} />
            <Route path="lessons/:lessonId/quiz" element={<QuizzesManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="dictionary" element={<DictionaryManager />} />
            <Route path="library" element={<LibraryManager />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
