import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import EngineerView from './pages/EngineerView'
import LeadDashboard from './pages/LeadDashboard'

export default function App () {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/engineer" element={<EngineerView/>}/>
      <Route path="/lead" element={<LeadDashboard />} />
    </Routes>
    </BrowserRouter>
  )
}