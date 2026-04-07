import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ArrowUpRight, Handshake, Edit, Trash2 } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Modal } from '../components/ui/Modal';
import { Dropdown } from '../components/ui/Dropdown';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState('Master_CV_React_v2.pdf');
  const [activeJob, setActiveJob] = useState<any>(null);
  const [cvSource, setCvSource] = useState<'master' | 'upload'>('master');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const jobs = [
    { id: 1, role: 'Senior Frontend Engineer', company: 'Vercel', status: 'Interviewing', date: 'Oct 12, 2026', cv: 'Master_CV_React_v2.pdf', badge: 'bg-orange-100 text-orange-700', url: 'https://vercel.com/jobs', jd: 'We are looking for a Senior Frontend Engineer...', notes: 'Referral from Sarah.' },
    { id: 2, role: 'Full Stack Developer', company: 'Stripe', status: 'Applied', date: 'Oct 15, 2026', cv: 'Master_CV_Fullstack.pdf', badge: 'bg-surface-300 text-ink', url: 'https://stripe.com/jobs', jd: 'Stripe is looking for...', notes: '' },
    { id: 3, role: 'Product Engineer', company: 'Linear', status: 'Take-home', date: 'Oct 10, 2026', cv: 'Master_CV_React_v2.pdf', badge: 'bg-blue-100 text-blue-700', url: 'https://linear.app/jobs', jd: 'Build the future of...', notes: 'Focus on UX.' },
  ];

  const handleOpenNew = () => {
    setActiveJob(null);
    setCvSource('master');
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleEdit = (job: any) => {
    setActiveJob(job);
    setSelectedCv(job.cv);
    setCvSource('master');
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <TopNav />
      
      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8">
        
        {/* Header / Premium Greeting */}
        <header className="mb-12 pt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Good morning, Developer</h1>
            <p className="text-ink-muted text-sm max-w-lg leading-relaxed">
              You are currently tracking <span className="text-blood-600 font-medium">12 active applications</span>. 
              You have 1 upcoming interview this week. Let's secure that offer.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-outline shrink-0">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button onClick={handleOpenNew} className="btn btn-primary shrink-0">
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </div>
        </header>

        {/* Quick Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Applied', value: '45', color: 'bg-surface-200' },
            { label: 'Interviewing', value: '4', color: 'bg-orange-50 text-orange-700 border border-orange-100' },
            { label: 'Offers', value: '1', color: 'bg-green-50 text-green-700 border border-green-100' },
            { label: 'Rejected', value: '18', color: 'bg-surface-100' },
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-xl flex flex-col justify-between h-32 ${stat.color} ${!stat.color.includes('border') && 'border border-surface-200'}`}>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{stat.label}</span>
              <span className="text-4xl font-light tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Board Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input 
              type="text" 
              placeholder="Search roles, companies, or keywords..." 
              className="w-full pl-9 pr-4 py-2 bg-surface-100 border border-transparent rounded-md text-sm focus:bg-white focus:border-blood-300 focus:outline-none focus:ring-2 focus:ring-blood-100 transition-all"
            />
          </div>
        </div>

        {/* Board / Table Layout */}
        <section className="bg-surface-100 border border-surface-200 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-surface-300 bg-surface-200 text-xs font-bold text-ink tracking-wider uppercase">
            <div className="col-span-4">Role & Company</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Applied Date</div>
            <div className="col-span-3">Assigned CV</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {/* List Items */}
          <div className="divide-y divide-surface-200">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="grid grid-cols-12 gap-4 p-4 items-center group hover:bg-surface-200/50 transition-colors cursor-pointer"
                onClick={() => handleEdit(job)}
              >
                {/* Same row content as before */}
                <div className="col-span-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-surface-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    <div className="text-lg font-bold text-blood-600">
                      {job.company?.charAt(0) || job.role.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-blood-600 transition-colors flex items-center gap-1">
                      {job.role}
                    </h3>
                    <p className="text-xs text-ink-muted mt-0.5">{job.company || job.role}</p>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${job.badge}`}>
                    {job.status}
                  </span>
                </div>
                
                <div className="col-span-2 text-sm text-ink-muted">
                  {job.date}
                </div>
                
                <div className="col-span-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-surface-200 rounded text-xs text-ink-muted hover:border-blood-300 hover:text-blood-600 transition-colors">
                    <span className="truncate max-w-[140px]">{job.cv}</span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  </div>
                </div>
                
                <div className="col-span-1 text-right flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <Dropdown 
                    align="right"
                    trigger={
                      <button className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface-300 rounded transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      { label: 'View / Edit', icon: <Edit className="w-4 h-4" />, onClick: () => handleEdit(job) },
                      { label: 'Prep Interview', icon: <Handshake className="w-4 h-4" />, onClick: () => console.log('Prep') },
                      { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => console.log('Delete') }
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Unified Application Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={activeJob ? `Edit Application: ${activeJob.company}` : "New Application"}
        size="xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[650px]">
          {/* Left Pane: Form */}
          <div className="p-6 overflow-y-auto border-r border-surface-200 custom-scrollbar">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Company</label>
                  <input defaultValue={activeJob?.company} type="text" className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner" placeholder="e.g. Acme Corp" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Role</label>
                  <input defaultValue={activeJob?.role} type="text" className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner" placeholder="e.g. Software Engineer" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">URL</label>
                  <input defaultValue={activeJob?.url} type="url" className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner" placeholder="https://..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Status</label>
                  <select defaultValue={activeJob?.status || "Pending"} className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner">
                    <option>Pending</option>
                    <option>Applied</option>
                    <option>Interviewing</option>
                    <option>Offered</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>

              {/* CV Source Toggle */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">CV Selection</label>
                <div className="flex bg-surface-100 p-1 rounded-lg border border-surface-200">
                  <button 
                    type="button"
                    onClick={() => setCvSource('master')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${cvSource === 'master' ? 'bg-white shadow-sm text-blood-600' : 'text-ink-muted hover:text-ink'}`}
                  >
                    Select Master
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCvSource('upload')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${cvSource === 'upload' ? 'bg-white shadow-sm text-blood-600' : 'text-ink-muted hover:text-ink'}`}
                  >
                    Upload New
                  </button>
                </div>

                {cvSource === 'master' ? (
                  <select 
                    value={selectedCv}
                    onChange={(e) => setSelectedCv(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner animate-in fade-in slide-in-from-top-1"
                  >
                    <option>Master_CV_React_v2.pdf</option>
                    <option>Master_CV_Fullstack.pdf</option>
                  </select>
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-1 space-y-3">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-surface-200 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-100 hover:bg-surface-200 hover:border-blood-300 transition-all cursor-pointer group"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".pdf" 
                        onChange={handleFileChange} 
                      />
                      <Plus className="w-6 h-6 text-ink-muted group-hover:text-blood-600 mb-1" />
                      <p className="text-xs font-medium">Click to upload custom CV</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-blood-600 focus:ring-blood-500 cursor-pointer" />
                      <span className="text-xs text-ink-muted group-hover:text-ink transition-colors font-medium">Save this CV to Master library</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Job Description</label>
                <textarea 
                  defaultValue={activeJob?.jd}
                  className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner min-h-[150px] leading-relaxed" 
                  placeholder="Paste the JD here to keep it forever..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Personal Notes</label>
                <textarea 
                  defaultValue={activeJob?.notes}
                  className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all shadow-inner min-h-[80px]" 
                  placeholder="Any specific thoughts on this role?"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-surface-bg py-2 border-t border-surface-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">{activeJob ? "Update Application" : "Save Application"}</button>
              </div>
            </form>
          </div>

          {/* Right Pane: Preview */}
          <div className="bg-surface-100 p-4 lg:p-10 flex items-center justify-center relative overflow-hidden h-full">
            {previewUrl ? (
              <div className="w-full h-full bg-white rounded shadow-2xl overflow-hidden border border-surface-200 animate-in zoom-in-95 duration-300">
                <iframe 
                  src={previewUrl} 
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="bg-white border border-surface-200 rounded-sm shadow-xl aspect-[1/1.414] w-full max-w-[340px] p-10 flex flex-col gap-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 w-40 bg-surface-100 rounded" />
                    <div className="h-3 w-24 bg-surface-100 rounded" />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-2 w-full bg-surface-100 rounded" />
                  ))}
                </div>
                <div className="mt-auto text-center py-4">
                  <p className="text-[10px] uppercase tracking-widest text-ink-muted font-bold opacity-30">Waiting for local asset</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
