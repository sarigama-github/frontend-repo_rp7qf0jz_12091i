import { useParams } from 'react-router-dom'
import { apiGet } from '../lib/api'
import { useEffect, useState } from 'react'

export default function Report() {
  const { sessionId } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{ (async()=> setData(await apiGet('/api/report', { session_id: sessionId })))() },[sessionId])

  const downloadPdf = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Your Interview Performance</h2>
        {data && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(data.categories).map(([k,v])=> (
                <div key={k} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                  <p className="text-slate-300">{k}</p>
                  <div className="w-full bg-slate-900 h-2 rounded mt-2">
                    <div className="bg-blue-500 h-2 rounded" style={{ width: `${v}%` }}></div>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{v}%</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
              <h4 className="font-semibold mb-2">7-day improvement plan</h4>
              <ol className="list-decimal list-inside text-slate-300 space-y-1">
                {data.plan.map((p,i)=>(<li key={i}>{p}</li>))}
              </ol>
            </div>
            <div className="flex gap-3">
              <button onClick={downloadPdf} className="px-5 py-3 rounded-xl bg-slate-700">Download PDF</button>
              <a href="/" className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600">Try Again</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
