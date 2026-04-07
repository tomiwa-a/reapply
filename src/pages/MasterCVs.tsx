import { Search, UploadCloud, MoreVertical } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';

export function MasterCVs() {
  const cvs = [
    { id: 1, name: 'Master_CV_React_v2.pdf', role: 'Frontend', size: '1.2 MB', date: 'Oct 05, 2026', tags: ['React', 'TS'] },
    { id: 2, name: 'Master_CV_Fullstack.pdf', role: 'Fullstack', size: '1.4 MB', date: 'Sep 28, 2026', tags: ['Node', 'SQL'] },
    { id: 3, name: 'Master_CV_Leading.pdf', role: 'Engineering Manager', size: '1.1 MB', date: 'Sep 01, 2026', tags: ['Agile', 'Leadership'] },
  ];

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
          <button className="btn btn-primary shrink-0">
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
                  <span className="font-bold text-xs uppercase">PDF</span>
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
    </div>
  );
}
