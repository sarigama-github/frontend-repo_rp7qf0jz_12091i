import { useEffect, useMemo, useState } from 'react'
import { Upload, Briefcase, Building2, Mic, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api'

export default function FormScreen() {
  const [params] = useSearchParams()
  const initialMode = params.get('mode') === 'voice' ? 'voice' : 'text'
  const [mode, setMode] = useState(initialMode)
  const [resumeFile, setResumeFile] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const [extractDone, setExtractDone] = useState(false)
  const [jobRole, setJobRole] = useState('Software Engineer')
  const [experience, setExperience] = useState('Fresher')
  const [company, setCompany] = useState('')
  const [difficulty, setDifficulty] = useState('Mixed')
  const [micTest, setMicTest] = useState(null)
  const [showMicTest, setShowMicTest] = useState(false)
  const navigate = useNavigate()

  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Engineer', 'ML Engineer', 'SRE'
  ]

  const experiences = ['Fresher', '1–3', '3–7', '7+']
  const difficulties = ['Easy', 'Intermediate', 'Advanced', 'Mixed']

  const onDrop = async (file) => {
    setResumeFile(file)
    setExtracting(true)
    try {
      const form = new FormData()
      form.append('file', file)
      await apiPost('/api/resume/extract', form, true)
      setExtractDone(true)
    } catch (e) {
      console.error(e)
    } finally {
      setExtracting(false)
    }
  }

  const start = async () => {
    if (mode === 'voice') {
      setShowMicTest(true)
      return
    }
    await createSessionAndGo()
  }

  const createSessionAndGo = async () => {
    const payload = {
      mode,
      job_role: jobRole,
      experience,
      company: company || undefined,
      difficulty,
      resume_text: extractDone ? 'skills extracted' : undefined,
    }
    const res = await apiPost('/api/session', payload)
    const sid = res.session_id
    if (mode === 'text') navigate(`/text/${sid}`)
    else navigate(`/voice/${sid}`)
  }

  const handleMicTest = async () => {
    // simple 3 sec mic record test
    if (!navigator.mediaDevices) {
      setMicTest('fail')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []
      mediaRecorder.ondataavailable = e => chunks.push(e.data)
      mediaRecorder.start()
      setTimeout(() => {
        mediaRecorder.stop()
      }, 3000)
      mediaRecorder.onstop = async () => {
        setMicTest('pass')
        setShowMicTest(false)
        await createSessionAndGo()
      }
    } catch (e) {
      setMicTest('fail')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Setup your interview</h2>

        <div className="space-y-6">
          {/* Upload Resume */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4"><Upload className="text-blue-400"/><h3 className="text-xl font-semibold">Upload Resume</h3></div>
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center">
              {!resumeFile ? (
                <label className="block cursor-pointer">
                  <input type="file" className="hidden" onChange={e => onDrop(e.target.files[0])} />
                  <p className="text-slate-300">Drag & drop or click to upload</p>
                </label>
              ) : (
                <div className="text-slate-300">{resumeFile.name}</div>
              )}
              {extracting && <p className="text-sm text-blue-300 mt-2">Extracting skills…</p>}
              {extractDone && <p className="text-sm text-green-300 mt-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Done</p>}
            </div>
          </div>

          {/* Job Details */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4"><Briefcase className="text-pink-400"/><h3 className="text-xl font-semibold">Job Details</h3></div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Job Role</label>
                <select value={jobRole} onChange={e=>setJobRole(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2">
                  {roles.map(r=> <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Experience</label>
                <select value={experience} onChange={e=>setExperience(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2">
                  {experiences.map(r=> <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Company (optional)</label>
                <input value={company} onChange={e=>setCompany(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2" placeholder="e.g., Google" />
              </div>
            </div>
          </div>

          {/* Interview Mode */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4"><Mic className="text-emerald-400"/><h3 className="text-xl font-semibold">Interview Mode</h3></div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={()=>setMode('text')} className={`rounded-xl p-4 border ${mode==='text'?'border-blue-500 bg-blue-500/10':'border-slate-700 bg-slate-900'}`}>
                <div className="flex items-center gap-2"><MessageSquare/> Text</div>
              </button>
              <button onClick={()=>setMode('voice')} className={`rounded-xl p-4 border ${mode==='voice'?'border-pink-500 bg-pink-500/10':'border-slate-700 bg-slate-900'}`}>
                <div className="flex items-center gap-2"><Mic/> Voice</div>
              </button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4"><span className="text-amber-400">🔥</span><h3 className="text-xl font-semibold">Difficulty</h3></div>
            <div className="flex flex-wrap gap-3">
              {difficulties.map(d => (
                <button key={d} onClick={()=>setDifficulty(d)} className={`px-4 py-2 rounded-lg border ${difficulty===d?'border-amber-500 bg-amber-500/10':'border-slate-700 bg-slate-900'}`}>{d}</button>
              ))}
            </div>
          </div>

          {/* CTA & Footer */}
          <div className="flex items-center justify-between">
            <div className="text-slate-400">Takes 15–25 mins • Instant results</div>
            <button onClick={start} className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">Start My Interview 🚀</button>
          </div>
        </div>
      </div>

      {showMicTest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h4 className="text-xl font-semibold mb-2">Mic Test</h4>
            <p className="text-slate-300 mb-4">Speak for 3 sec.</p>
            <div className="flex gap-3">
              <button onClick={handleMicTest} className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600">Start</button>
              <button onClick={()=>setShowMicTest(false)} className="px-4 py-2 rounded-lg bg-slate-700">Cancel</button>
            </div>
            {micTest==='pass' && <p className="text-green-400 mt-3">✔ Passed</p>}
            {micTest==='fail' && <p className="text-red-400 mt-3">✖ Failed</p>}
          </div>
        </div>
      )}
    </div>
  )
}
