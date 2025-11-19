import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import FormScreen from './components/Form'
import TextInterview from './components/TextInterview'
import VoiceInterview from './components/VoiceInterview'
import Summary from './components/Summary'
import Report from './components/Report'
import Payment from './components/Payment'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<FormScreen />} />
        <Route path="/text/:sessionId" element={<TextInterview />} />
        <Route path="/voice/:sessionId" element={<VoiceInterview />} />
        <Route path="/summary/:sessionId" element={<Summary />} />
        <Route path="/report/:sessionId" element={<Report />} />
        <Route path="/pay" element={<Payment />} />
      </Routes>
    </div>
  )
}

export default App
