import { Briefcase, FileText, Bot, Bell, Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';

export function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavClass = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-medium flex items-center gap-2 relative transition-colors ${
      isActive 
        ? 'text-blood-600 after:absolute after:-bottom-5 md:after:-bottom-5 after:left-0 after:h-0.5 after:w-full after:bg-blood-600' 
        : 'text-ink-muted hover:text-ink'
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-surface-bg border-b border-surface-200 z-50 flex items-center justify-between px-6 lg:px-12 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-ink-muted hover:text-blood-600 transition-colors p-1"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blood-600 flex items-center justify-center text-white font-bold tracking-tighter">
              r
            </div>
            <span className="font-bold text-lg tracking-tight select-none">
              reapply<span className="text-blood-600">.</span>
            </span>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
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
        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden sm:flex text-ink-muted hover:text-blood-600 transition-colors p-2 rounded-full hover:bg-surface-200">
            <Bell className="w-5 h-5" />
          </button>
          
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary text-[10px] md:text-xs py-1 px-2 md:py-1.5 md:px-3">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-surface-200 p-6 flex flex-col gap-6 slide-in-from-top-4 animate-in duration-300">
            <NavLink 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 text-base font-semibold transition-colors ${isActive ? 'text-blood-600' : 'text-ink'}`}
            >
              <Briefcase className="w-5 h-5" />
              Dashboard
            </NavLink>
            <NavLink 
              to="/cvs" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 text-base font-semibold transition-colors ${isActive ? 'text-blood-600' : 'text-ink'}`}
            >
              <FileText className="w-5 h-5" />
              Master CVs
            </NavLink>
            <NavLink 
              to="/ai-prep" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 text-base font-semibold transition-colors ${isActive ? 'text-blood-600' : 'text-ink'}`}
            >
              <Bot className="w-5 h-5" />
              AI Prep
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
}
