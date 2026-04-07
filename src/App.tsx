import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Dashboard } from './pages/Dashboard';
import { MasterCVs } from './pages/MasterCVs';
import { AIPrep } from './pages/AIPrep';

// Use standard publishable key env variable for Vite + Clerk
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder_key";

export function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cvs" element={<MasterCVs />} />
          <Route path="/ai-prep" element={<AIPrep />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
