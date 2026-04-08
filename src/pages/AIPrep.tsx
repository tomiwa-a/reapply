import { useState } from 'react';
import { Send, Bot, FileText, ChevronDown, Sparkles } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dropdown } from '../components/ui/Dropdown';

export function AIPrep() {
  const [prompt, setPrompt] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  const jobs = useQuery(api.jobs.listJobs);
  const selectedJob = jobs?.find(j => j._id === selectedJobId) || jobs?.[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // For now, this is a placeholder until AI actions are implemented
    console.log("Sending prompt:", prompt);
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col h-screen overflow-hidden">
      <TopNav />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-64px)] mt-16 overflow-hidden">
        
        {/* Left Pane: Job Context */}
        <section className="w-full md:w-1/3 flex flex-col bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-surface-200 bg-surface-100 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Context & Job Description</h2>
            <Dropdown 
              align="right"
              trigger={
                <button className="text-xs font-medium text-blood-600 hover:text-blood-700 bg-blood-50 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                  {selectedJob ? "Switch Application" : "Select Application"} <ChevronDown className="w-3 h-3" />
                </button>
              }
              items={jobs?.map(job => ({
                label: `${job.role} at ${job.company}`,
                onClick: () => setSelectedJobId(job._id)
              })) || []}
            />
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {selectedJob ? (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="mb-4">
                  <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-1">Target Application</p>
                  <h3 className="text-lg font-bold">{selectedJob.role}</h3>
                  <p className="text-sm text-ink-muted">{selectedJob.company}</p>
                </div>
                
                <div className="mb-4 pt-4 border-t border-surface-200">
                  <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Saved JD
                  </p>
                  <div className="text-sm text-ink leading-relaxed space-y-3 bg-surface-100 p-3 rounded-lg border border-surface-200 shadow-inner max-h-[500px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                    {selectedJob.jd || "No job description saved for this application."}
                  </div>
                </div>

                <div className="p-3 bg-blood-50 rounded-lg border border-blood-100 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-blood-600 mt-1 shrink-0" />
                  <p className="text-[11px] text-blood-800 leading-relaxed font-medium">
                    This context is sent to the Coach to ensure answers are tailored to this specific role and your resume.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                <FileText className="w-12 h-12 mb-2 text-ink-muted" />
                <p className="text-sm font-medium">Select a job to provide context for the coach.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: AI Chat */}
        <section className="w-full md:w-2/3 flex flex-col bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm relative">
          <div className="p-4 border-b border-surface-200 bg-surface-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blood-600 flex items-center justify-center text-white shadow-lg shadow-blood-900/20">
                <Bot className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-sm">Interview Coach</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 uppercase tracking-wide border border-green-200">
              Live Connection Ready
            </span>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-surface-200/20">
            {/* System Message */}
            <div className="flex gap-4 animate-in slide-in-from-top-2 duration-500">
              <div className="w-8 h-8 rounded-lg bg-surface-bg border border-surface-200 flex-shrink-0 flex items-center justify-center text-ink shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Reapply Coach</p>
                <div className="text-sm text-ink leading-relaxed p-4 bg-white border border-surface-200 shadow-sm rounded-2xl rounded-tl-none inline-block max-w-[80%]">
                  <p className="mb-3">I've got the JD context for {selectedJob?.company || "your role"}.</p>
                  <p>Ready to help you prep. What would you like to focus on?</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button className="text-[11px] px-3 py-1.5 bg-surface-100 hover:bg-surface-200 rounded-full border border-surface-200 transition-colors">Mock Interview</button>
                    <button className="text-[11px] px-3 py-1.5 bg-surface-100 hover:bg-surface-200 rounded-full border border-surface-200 transition-colors">Common Questions</button>
                    <button className="text-[11px] px-3 py-1.5 bg-surface-100 hover:bg-surface-200 rounded-full border border-surface-200 transition-colors">Refine Answers</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-surface-200">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={selectedJob ? "Ask for interview prep, mock questions..." : "Select a job application to start prepping..."} 
                className="w-full pl-4 pr-12 py-3 bg-surface-100 border border-surface-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blood-400 focus:border-transparent transition-all shadow-inner"
                disabled={!selectedJob}
              />
              <button 
                type="submit"
                disabled={!prompt.trim() || !selectedJob}
                className="absolute right-2 p-1.5 bg-blood-600 text-white rounded-md hover:bg-blood-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blood-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-ink-muted text-center mt-3 uppercase tracking-widest opacity-50">
              AI uses your saved job context & resume for tailored prep
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
