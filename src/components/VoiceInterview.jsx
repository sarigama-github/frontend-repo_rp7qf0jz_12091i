import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api'

export default function VoiceInterview() {
  const { sessionId } = useParams()
  const [question, setQuestion] = useState(null)
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [chunks, setChunks] = useState([])
  const [feedback, setFeedback] = useState(null)

  useEffect(()=>{ loadQ() }, [])

  const loadQ = async () => {
    const res = await apiGet('/api/text/question', { session_id: sessionId, difficulty: 'Mixed' })
    setQuestion(res.question)
  }

  const startRec = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
    setChunks([])
    mr.ondataavailable = e => setChunks(prev => [...prev, e.data])
    mr.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const form = new FormData()
      form.append('session_id', sessionId)
      form.append('question_id', question.id)
      form.append('audio', blob, 'answer.webm')
      const res = await apiPost('/api/voice/answer', form, true)
      setFeedback(res)
    }
    mr.start()
    setMediaRecorder(mr)
    setRecording(true)
  }

  const stopRec = () => {
    mediaRecorder.stop()
    setRecording(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="text-sm text-amber-400 mb-2">{question?.difficulty}</div>
          <div className="text-lg mb-4">{question?.text}</div>
          <div className="h-16 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">{recording? 'Recording… wave…' : 'Waveform placeholder'}</div>
        </div>

        <div className="flex gap-3">
          {!recording ? (
            <button onClick={startRec} className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600">Start</button>
          ) : (
            <button onClick={stopRec} className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600">Stop & Submit</button>
          )}
          <button onClick={loadQ} className="px-4 py-2 rounded-lg bg-slate-700">Retry</button>
        </div>

        {feedback && (
          <div className="mt-6 bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-2">Feedback</h4>
            <div className="grid md:grid-cols-2 gap-3 text-slate-300">
              <p>Tone: {feedback.tone}</p>
              <p>Clarity: {feedback.clarity}</p>
              <p>Confidence: {feedback.confidence}</p>
              <p>Grammar: {feedback.grammar}</p>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-slate-200">Correct answer</summary>
              <p className="text-slate-300 mt-2">{feedback.correct_answer}</p>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
