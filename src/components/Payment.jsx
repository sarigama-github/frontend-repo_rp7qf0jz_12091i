import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiPost } from '../lib/api'

export default function Payment() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const mode = params.get('mode') || 'text'
  const amount = mode === 'voice' ? 119 : 49

  const pay = async () => {
    await apiPost('/api/payment/initiate', new FormData(Object.assign(document.createElement('form'), { amount, mode })), true).catch(()=>{})
    navigate(`/form?mode=${mode}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-md mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-300 mb-2">{mode === 'voice' ? 'Voice' : 'Text'} Interview</p>
            <p className="text-3xl font-semibold">₹{amount}</p>
            <p className="text-slate-400 mt-2">{mode==='voice'?'tone + confidence analysis':'4 rounds + feedback'}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-300 mb-2">Payment Options</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-2 rounded-lg bg-slate-700">UPI</button>
              <button className="px-4 py-2 rounded-lg bg-slate-700">GPay</button>
              <button className="px-4 py-2 rounded-lg bg-slate-700">PhonePe</button>
              <button className="px-4 py-2 rounded-lg bg-slate-700">Card</button>
            </div>
          </div>
          <button onClick={pay} className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">Pay & Start Interview</button>
        </div>
      </div>
    </div>
  )
}
