import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EngineerView from './pages/EngineerView'
import LeadDashboard from './pages/LeadDashboard'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/engineer" element={
            <ProtectedRoute allowedRole="engineer">
              <EngineerView />
            </ProtectedRoute>
          } />
          <Route path="/lead" element={
            <ProtectedRoute allowedRole="lead">
              <LeadDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App