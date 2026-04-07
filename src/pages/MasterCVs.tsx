import React, { useState } from 'react';
import { Search, UploadCloud, MoreVertical, FileText, X, Plus } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Modal } from '../components/ui/Modal';

export function MasterCVs() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript']);
  const [tagInput, setTagInput] = useState('');

  const cvs = [
    { id: 1, name: 'Master_CV_React_v2.pdf', role: 'Frontend', size: '1.2 MB', date: 'Oct 05, 2026', tags: ['React', 'TS'] },
    { id: 2, name: 'Master_CV_Fullstack.pdf', role: 'Fullstack', size: '1.4 MB', date: 'Sep 28, 2026', tags: ['Node', 'SQL'] },
    { id: 3, name: 'Master_CV_Leading.pdf', role: 'Engineering Manager', size: '1.1 MB', date: 'Sep 01, 2026', tags: ['Agile', 'Leadership'] },
  ];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <TopNav />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8">
        <header className="mb-12 pt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Master CV Library</h1>
            <p className="text-ink-muted text-sm max-w-lg leading-relaxed">
              Upload your base resumes here. When you save a new application, link it to one of these Master CVs so you know exactly which version they received.
            </p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-primary shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            Upload New CV
          </button>
        </header>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input 
              type="text" 
              placeholder="Search CVs..." 
              className="w-full pl-9 pr-4 py-2 bg-surface-100 border border-transparent rounded-md text-sm focus:bg-white focus:border-blood-300 focus:outline-none focus:ring-2 focus:ring-blood-100 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div key={cv.id} className="bg-white border border-surface-200 rounded-xl p-5 hover:border-blood-300 transition-colors group relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded bg-surface-100 flex items-center justify-center text-ink-muted group-hover:bg-blood-50 group-hover:text-blood-600 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <button className="text-ink-muted hover:text-ink p-1 -mr-2">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-semibold text-sm mb-1 truncate" title={cv.name}>{cv.name}</h3>
              <p className="text-xs text-ink-muted mb-4">{cv.role} • {cv.size} • {cv.date}</p>
              
              <div className="flex items-center gap-2">
                {cv.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-surface-100 text-ink-muted rounded-full text-[10px] font-medium tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Master CV"
        size="xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[550px]">
          {/* Left: Upload and Meta */}
          <div className="p-6 overflow-y-auto border-r border-surface-200 custom-scrollbar flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Select File</label>
                <div className="border-2 border-dashed border-surface-200 rounded-lg p-8 flex flex-col items-center justify-center bg-surface-100 hover:bg-surface-200 transition-colors cursor-pointer group">
                  <UploadCloud className="w-10 h-10 text-ink-muted group-hover:text-blood-600 transition-colors mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-ink-muted mt-1">PDF, DOCX up to 10MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Document Name</label>
                <input type="text" className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner" placeholder="e.g. Master_CV_Frontend_2026.pdf" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blood-50 text-blood-700 rounded text-xs font-medium">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-blood-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-1.5 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner" 
                    placeholder="Add tag..." 
                  />
                  <button onClick={addTag} type="button" className="p-2 bg-surface-200 hover:bg-surface-300 rounded-md transition-colors text-ink">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-surface-200 mt-6 bg-surface-bg sticky bottom-0">
              <button onClick={() => setIsUploadModalOpen(false)} className="btn btn-ghost">Cancel</button>
              <button className="btn btn-primary">Save to Library</button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="bg-surface-100 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blood-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="w-full max-w-[320px] bg-white border border-surface-200 rounded-sm shadow-2xl aspect-[1/1.414] overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
              {/* Actual PDF mock logic - since we have dummy_cv.pdf, we could even use an iframe but for a "premium" dashboard look, a stylized preview is better for the UI */}
              <div className="absolute inset-0 p-8 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <div className="h-5 w-40 bg-ink rounded-sm" />
                    <div className="h-2 w-24 bg-ink-muted/20 rounded-full" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blood-600 flex items-center justify-center text-[8px] font-bold text-white tracking-tighter">
                    PDF
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full bg-surface-200 rounded-full" />
                  <div className="h-2 w-full bg-surface-200 rounded-full" />
                  <div className="h-2 w-3/4 bg-surface-200 rounded-full" />
                </div>

                <div className="mt-4 pt-4 border-t border-surface-100 space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-surface-300 rounded-sm" />
                    <div className="h-2 w-full bg-surface-100 rounded-full" />
                    <div className="h-2 w-full bg-surface-100 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-surface-300 rounded-sm" />
                    <div className="h-2 w-full bg-surface-100 rounded-full" />
                  </div>
                </div>

                <div className="mt-auto flex flex-col items-center gap-2 pb-2">
                  <p className="text-[10px] font-bold text-blood-600/40 uppercase tracking-[0.2em]">Contextual Engine Preview</p>
                  <div className="h-1 w-20 bg-blood-600/10 rounded-full" />
                </div>
              </div>

              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/30" />
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs font-semibold text-ink uppercase tracking-widest">Live Preview</p>
              <p className="text-[10px] text-ink-muted/50 mt-1 uppercase tracking-[0.3em]">reapply systems</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
