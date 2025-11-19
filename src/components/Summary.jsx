import { useParams, Link } from 'react-router-dom'
import { apiGet } from '../lib/api'
import { useEffect, useState } from 'react'

export default function Summary() {
  const { sessionId } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{ (async()=> setData(await apiGet('/api/summary', { session_id: sessionId })))() },[sessionId])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Round Summary</h2>
        {data && (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
              <p className="text-2xl font-semibold">Score: {data.score}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4"><h4 className="font-semibold mb-2">Strengths</h4><ul className="text-slate-300 list-disc list-inside space-y-1">{data.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul></div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4"><h4 className="font-semibold mb-2">Mistakes</h4><ul className="text-slate-300 list-disc list-inside space-y-1">{data.mistakes.map((s,i)=><li key={i}>{s}</li>)}</ul></div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4"><h4 className="font-semibold mb-2">Improve</h4><ul className="text-slate-300 list-disc list-inside space-y-1">{data.tips.map((s,i)=><li key={i}>{s}</li>)}</ul></div>
            </div>
            <Link to={`/report/${sessionId}`} className="inline-block px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600">Next Round</Link>
          </div>
        )}
      </div>
    </div>
  )
}
