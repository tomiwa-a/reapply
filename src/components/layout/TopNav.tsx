import React from 'react';
import { Briefcase, FileText, Bot, UserCircle, Bell } from 'lucide-react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';

export function TopNav() {
  const getNavClass = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-medium flex items-center gap-2 relative transition-colors ${
      isActive 
        ? 'text-blood-600 after:absolute after:-bottom-5 after:left-0 after:h-0.5 after:w-full after:bg-blood-600' 
        : 'text-ink-muted hover:text-ink'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-surface-bg border-b border-surface-200 z-40 flex items-center justify-between px-6 lg:px-12 backdrop-blur-md bg-opacity-90">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blood-600 flex items-center justify-center text-white font-bold tracking-tighter">
          r
        </div>
        <span className="font-bold text-lg tracking-tight select-none">
          reapply<span className="text-blood-600">.</span>
        </span>
      </div>

      {/* Center Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink to="/" className={getNavClass}>
          <Briefcase className="w-4 h-4" />
          Dashboard
        </NavLink>
        <NavLink to="/cvs" className={getNavClass}>
          <FileText className="w-4 h-4" />
          Master CVs
        </NavLink>
        <NavLink to="/ai-prep" className={getNavClass}>
          <Bot className="w-4 h-4" />
          AI Prep
        </NavLink>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button className="text-ink-muted hover:text-blood-600 transition-colors p-2 rounded-full hover:bg-surface-200">
          <Bell className="w-5 h-5" />
        </button>
        
        <SignedIn>
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-primary text-xs py-1.5 px-3">Sign In</button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
