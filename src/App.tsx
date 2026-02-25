import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { TeamTree } from './pages/TeamTree';
import { Wallet } from './pages/Wallet';
import { P2P } from './pages/P2P';
import { Pension } from './pages/Pension';
import { RankProgress } from './pages/RankProgress';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team-tree" element={<TeamTree />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/p2p" element={<P2P />} />
            <Route path="/pension" element={<Pension />} />
            <Route path="/rank-progress" element={<RankProgress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
