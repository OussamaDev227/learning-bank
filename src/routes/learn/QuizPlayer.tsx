import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/auth'
import type { Quiz, QuizQuestion } from '../../types/domain'

export function QuizPlayer() {
  const { courseId, lessonId } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }
    if (!lessonId) return

    async function load() {
      try {
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('lesson_id', lessonId)
          .single()
        if (!quizData) return
        setQuiz(quizData as Quiz)

        const { data: questionData } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizData.id)
          .order('order_index', { ascending: true })
        setQuestions((questionData as QuizQuestion[]) ?? [])
      } catch {
        setLoadFailed(true)
      }
    }
    void load()
  }, [lessonId, session, navigate])

  function selectAnswer(index: number) {
    setAnswers((a) => {
      const next = [...a]
      next[step] = index
      return next
    })
  }

  async function submit() {
    const score = questions.reduce(
      (sum, q, i) => sum + (answers[i] === q.correct_index ? 1 : 0),
      0
    )
    const total = questions.length
    setResult({ score, total })

    if (session && quiz) {
      await supabase.from('quiz_attempts').insert({
        user_id: session.user.id,
        quiz_id: quiz.id,
        score,
        total,
      })
    }
  }

  if (loadFailed) {
    return <p className="text-sm text-text-muted">تعذّر تحميل الاختبار. حاول مرة أخرى لاحقاً.</p>
  }

  if (!quiz || questions.length === 0) {
    return <p className="text-sm text-text-muted">جارِ تحميل الاختبار...</p>
  }

  if (result) {
    return (
      <Card className="max-w-md mx-auto text-center py-8">
        <p className="text-sm text-text-muted mb-1">نتيجتك</p>
        <p className="font-extrabold text-3xl text-primary-600 mb-4">
          {result.score} / {result.total}
        </p>
        <Link to={`/learn/${courseId}`}>
          <Button>العودة إلى الدورة</Button>
        </Link>
      </Card>
    )
  }

  const question = questions[step]
  const isLast = step === questions.length - 1

  return (
    <div className="max-w-md mx-auto">
      <p className="text-xs text-text-muted mb-2">
        سؤال {step + 1} من {questions.length}
      </p>
      <Card>
        <p className="font-bold text-text-primary mb-4">{question.question_text}</p>
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              className={`w-full text-right rounded-xl px-4 py-2.5 text-sm border transition-colors ${
                answers[step] === i
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-page text-text-primary border-transparent hover:border-primary-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-5">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            السابق
          </Button>
          {isLast ? (
            <Button onClick={submit} disabled={answers[step] === undefined}>
              إنهاء الاختبار
            </Button>
          ) : (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={answers[step] === undefined}
            >
              التالي
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
