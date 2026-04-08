import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { api } from "../convex/_generated/api";
import { Dashboard } from './pages/Dashboard';
import { MasterCVs } from './pages/MasterCVs';
import { AIPrep } from './pages/AIPrep';

// Environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder_key";
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "";

const convex = new ConvexReactClient(CONVEX_URL);

function UserSync() {
  const storeUser = useMutation(api.users.storeUser);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      storeUser();
    }
  }, [isLoaded, isSignedIn, storeUser]);

  return null;
}

export function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cvs" element={<MasterCVs />} />
            <Route path="/ai-prep" element={<AIPrep />} />
          </Routes>
        </Router>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default App;
