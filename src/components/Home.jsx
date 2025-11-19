import { MessageSquare, Mic } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI Mock Interview</h1>
          <p className="text-slate-300 mt-3">Improve your interview skills instantly.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="group rounded-2xl bg-slate-800/60 border border-slate-700 p-6 hover:border-blue-500/60 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Text Interview <span className="text-blue-300">₹49</span></h3>
                <p className="text-slate-300 mt-1">Fast, accurate, instant feedback.</p>
              </div>
              <MessageSquare className="w-10 h-10 text-blue-400" />
            </div>
            <Link to="/form?mode=text" className="mt-6 inline-block px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">Start Text</Link>
          </div>

          <div className="group rounded-2xl bg-slate-800/60 border border-slate-700 p-6 hover:border-pink-500/60 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Voice Interview <span className="text-pink-300">₹119</span></h3>
                <p className="text-slate-300 mt-1">Real-time AI voice, tone analysis.</p>
              </div>
              <Mic className="w-10 h-10 text-pink-400" />
            </div>
            <Link to="/form?mode=voice" className="mt-6 inline-block px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600">Start Voice</Link>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-6">Takes 15–25 mins • Instant results</p>
      </div>
    </div>
  )
}
