import React, { useState, useRef } from 'react';
import { Search, UploadCloud, MoreVertical, FileText, X, Plus, Eye, Trash2, Download } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Modal } from '../components/ui/Modal';
import { Dropdown } from '../components/ui/Dropdown';

export function MasterCVs() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingCv, setViewingCv] = useState<any>(null);
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript']);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cvs, setCvs] = useState([
    { id: 1, name: 'Master_CV_React_v2.pdf', role: 'Frontend', size: '1.2 MB', date: 'Oct 05, 2026', tags: ['React', 'TS'] },
    { id: 2, name: 'Master_CV_Fullstack.pdf', role: 'Fullstack', size: '1.4 MB', date: 'Sep 28, 2026', tags: ['Node', 'SQL'] },
    { id: 3, name: 'Master_CV_Leading.pdf', role: 'Engineering Manager', size: '1.1 MB', date: 'Sep 01, 2026', tags: ['Agile', 'Leadership'] },
  ]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      setCvs(cvs.filter(cv => cv.id !== id));
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      // In a real app, we would handle the upload here
    }
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
                <div className="w-12 h-12 rounded bg-surface-100 flex items-center justify-center text-ink-muted group-hover:bg-blood-50 group-hover:text-blood-600 transition-colors cursor-pointer" onClick={() => setViewingCv(cv)}>
                  <FileText className="w-6 h-6" />
                </div>
                <Dropdown 
                  align="right"
                  trigger={
                    <button className="text-ink-muted hover:text-ink p-1 -mr-2 bg-surface-100/0 hover:bg-surface-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                  items={[
                    { label: 'View Fullscreen', icon: <Eye className="w-4 h-4" />, onClick: () => setViewingCv(cv) },
                    { label: 'Download PDF', icon: <Download className="w-4 h-4" />, onClick: () => console.log('Download') },
                    { label: 'Delete Document', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => handleDelete(cv.id) }
                  ]}
                />
              </div>
              
              <h3 className="font-semibold text-sm mb-1 truncate cursor-pointer hover:text-blood-600 transition-colors" title={cv.name} onClick={() => setViewingCv(cv)}>
                {cv.name}
              </h3>
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
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx" 
                  onChange={handleFileChange}
                />
                <div 
                  onClick={triggerFileUpload}
                  className="border-2 border-dashed border-surface-200 rounded-lg p-8 flex flex-col items-center justify-center bg-surface-100 hover:bg-surface-200 hover:border-blood-300 transition-all cursor-pointer group"
                >
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
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blood-50 text-blood-700 rounded text-xs font-medium border border-blood-100">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-blood-900 transition-colors">
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
              <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(false)}>Save to Library</button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="bg-surface-100 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blood-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="w-full max-w-[320px] bg-white border border-surface-200 rounded-sm shadow-2xl aspect-[1/1.414] overflow-hidden relative group-hover:scale-[1.01] transition-transform duration-500">
              <div className="absolute inset-0 p-8 flex flex-col gap-4 bg-white">
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
                <div className="mt-4 pt-4 border-t border-surface-100 space-y-4 font-mono text-[8px] text-ink-muted/40 uppercase tracking-widest">
                  Preview context active
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewingCv}
        onClose={() => setViewingCv(null)}
        title={`Review: ${viewingCv?.name}`}
        size="lg"
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="w-full max-w-[450px] bg-white border border-surface-200 rounded shadow-2xl aspect-[1/1.414] p-12 flex flex-col gap-6 relative group overflow-hidden">
             {/* Realistic PDF simulation */}
             <div className="flex justify-between items-start">
               <div className="space-y-2">
                 <div className="h-6 w-48 bg-ink rounded-sm" />
                 <div className="h-3 w-32 bg-ink-muted/10 rounded-full" />
               </div>
               <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-xs font-bold text-ink">
                 1/1
               </div>
             </div>
             
             <div className="space-y-3 mt-4">
               <div className="h-2 w-full bg-surface-100 rounded-full" />
               <div className="h-2 w-full bg-surface-100 rounded-full" />
               <div className="h-2 w-full bg-surface-100 rounded-full" />
               <div className="h-2 w-4/5 bg-surface-100 rounded-full" />
             </div>

             <div className="mt-8 space-y-4">
               <div className="h-4 w-40 bg-surface-200 rounded-sm" />
               <div className="space-y-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex gap-2 items-center">
                     <div className="h-1.5 w-1.5 rounded-full bg-blood-600/30 shrink-0" />
                     <div className="h-2 w-full bg-surface-100 rounded-full" />
                   </div>
                 ))}
               </div>
             </div>

             {/* Watermark */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-45">
               <span className="text-6xl font-bold tracking-tighter">REAPPLY</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4 w-full justify-center">
            <button className="btn btn-outline gap-2">
              <Download className="w-4 h-4" />
              Download Original
            </button>
            <button onClick={() => setViewingCv(null)} className="btn btn-primary">
              Done Reviewing
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
