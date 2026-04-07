import { useState } from 'react';
import { Send, Bot, FileText, ChevronDown } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';

export function AIPrep() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col h-screen overflow-hidden">
      <TopNav />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-64px)] mt-16">
        
        {/* Left Pane: Job Context */}
        <section className="w-full md:w-1/3 flex flex-col bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-surface-200 bg-surface-100 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Context & Job Description</h2>
            <button className="text-xs font-medium text-blood-600 hover:text-blood-700 bg-blood-50 px-2 py-1 rounded flex items-center gap-1 transition-colors">
              Select Application <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-4">
              <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-1">Target Application</p>
              <h3 className="text-lg font-bold">Senior Frontend Engineer</h3>
              <p className="text-sm text-ink-muted">Vercel</p>
            </div>
            
            <div className="mb-4 pt-4 border-t border-surface-200">
              <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Active JD
              </p>
              <div className="text-sm text-ink leading-relaxed space-y-3 bg-surface-100 p-3 rounded-lg border border-surface-200 shadow-inner max-h-[400px] overflow-y-auto">
                <p>We are looking for a Senior Frontend Engineer to join our Core Team...</p>
                <p>Requirements:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>5+ years of React experience.</li>
                  <li>Deep understanding of performance optimization.</li>
                  <li>Experience with Next.js and Edge networking.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: AI Chat */}
        <section className="w-full md:w-2/3 flex flex-col bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm relative">
          <div className="p-4 border-b border-surface-200 bg-surface-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blood-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-sm">Interview Coach</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 uppercase tracking-wide">
              API Connected
            </span>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* System Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-surface-200 flex-shrink-0 flex items-center justify-center text-ink">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Reapply Coach</p>
                <div className="text-sm text-ink leading-relaxed p-4 bg-surface-100 rounded-2xl rounded-tl-none inline-block">
                  <p className="mb-3">I've analyzed the Vercel Job Description against your Master_CV_React_v2.pdf.</p>
                  <p>Here are 3 common questions they might ask based on your profile:</p>
                  <ol className="list-decimal pl-4 mt-2 space-y-1 text-ink-muted">
                    <li>Can you describe a time you dramatically improved a React app's performance?</li>
                    <li>How do you handle state synchronization across edge edges?</li>
                    <li>What is your experience with React Server Components?</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* User Message */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-8 h-8 rounded-lg bg-blood-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                Me
              </div>
              <div className="flex-1 flex flex-col items-end">
                <p className="text-sm font-semibold mb-1">You</p>
                <div className="text-sm text-white leading-relaxed p-4 bg-ink rounded-2xl rounded-tr-none inline-block">
                  <p>Draft an answer for the performance question utilizing my recent project at Acme Corp.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-surface-200">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask for interview prep, mock questions, technical concepts..." 
                className="w-full pl-4 pr-12 py-3 bg-surface-100 border border-surface-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blood-400 focus:border-transparent transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!prompt.trim()}
                className="absolute right-2 p-1.5 bg-blood-600 text-white rounded-md hover:bg-blood-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}
