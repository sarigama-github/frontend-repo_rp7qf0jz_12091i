import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api'

export default function TextInterview() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [progress, setProgress] = useState({ current: 0, total: 5 })
  const [feedback, setFeedback] = useState(null)

  useEffect(() => { loadQ() }, [])

  const loadQ = async () => {
    const res = await apiGet('/api/text/question', { session_id: sessionId, difficulty: 'Mixed' })
    setQuestion(res.question)
    setProgress(res.progress)
    setFeedback(null)
    setAnswer('')
  }

  const submit = async () => {
    const res = await apiPost('/api/text/answer', { session_id: sessionId, question_id: question.id, answer })
    setFeedback(res)
  }

  const skip = async () => {
    await loadQ()
  }

  const next = async () => {
    await loadQ()
  }

  const percent = Math.round((progress.current / progress.total) * 100)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mr-4">
            <div className="h-2 bg-blue-500" style={{ width: `${percent}%` }}></div>
          </div>
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white">Exit</button>
        </div>

        {/* Question */}
        {question && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6">
            <div className="text-sm text-amber-400 mb-2">{question.difficulty}</div>
            <div className="text-lg">{question.text}</div>
          </div>
        )}

        {/* Answer */}
        <textarea value={answer} onChange={e=>setAnswer(e.target.value)} rows={6} placeholder="Type your answer…" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 mb-4"/>

        <div className="flex gap-3">
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">Submit</button>
          <button onClick={skip} className="px-4 py-2 rounded-lg bg-slate-700">Skip</button>
        </div>

        {feedback && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
              <h4 className="text-xl font-semibold mb-2">Feedback</h4>
              <p className={`mb-2 ${feedback.correct? 'text-green-400':'text-red-400'}`}>{feedback.correct? 'Correct':'Incorrect'}</p>
              <p className="text-slate-300 mb-2">Grammar fixes: {feedback.grammar_fixes}</p>
              <p className="text-slate-300 mb-2">Content score: {feedback.content_score}</p>
              <details className="mb-4">
                <summary className="cursor-pointer text-slate-200">Correct answer</summary>
                <p className="text-slate-300 mt-2">{feedback.correct_answer}</p>
              </details>
              <div className="flex gap-3">
                <button onClick={next} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">Next Question</button>
                <button onClick={()=>setFeedback(null)} className="px-4 py-2 rounded-lg bg-slate-700">Try Again</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
