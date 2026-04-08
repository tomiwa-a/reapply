import React, { useState, useRef } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ArrowUpRight, Edit, Trash2 } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Modal } from '../components/ui/Modal';
import { Dropdown } from '../components/ui/Dropdown';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { EmptyState } from '../components/ui/EmptyState';
import { Briefcase as BriefcaseIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState<string>('');
  const [activeJob, setActiveJob] = useState<any>(null);
  const [cvSource, setCvSource] = useState<'master' | 'upload'>('master');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saveToMaster, setSaveToMaster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex Hooks
  const jobs = useQuery(api.jobs.listJobs);
  const cvs = useQuery(api.cvs.listCvs);
  const createJob = useMutation(api.jobs.createJob);
  const updateJob = useMutation(api.jobs.updateJob);
  const removeJob = useMutation(api.jobs.removeJob);
  const generateUploadUrl = useMutation(api.cvs.generateUploadUrl);
  const saveCv = useMutation(api.cvs.saveCv);

  const handleOpenNew = () => {
    setActiveJob(null);
    setCvSource('master');
    setPreviewUrl(null);
    setSelectedFile(null);
    setSelectedCv('');
    setIsModalOpen(true);
  };

  const handleEdit = (job: any) => {
    setActiveJob(job);
    setSelectedCv(job.cvId || '');
    setCvSource('master');
    
    // Find preview URL if CV exists
    if (job.cvId) {
      const cv = cvs?.find(c => c._id === job.cvId);
      if (cv?.url) setPreviewUrl(cv.url);
    } else {
      setPreviewUrl(null);
    }
    
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      let finalCvId = selectedCv;
      let finalCvStorageId: any = undefined;

      // Handle custom upload if needed
      if (cvSource === 'upload' && selectedFile) {
        try {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": selectedFile.type },
            body: selectedFile,
          });
          const { storageId } = await result.json();
          finalCvStorageId = storageId;

          if (saveToMaster) {
            const newCvId = await saveCv({
              name: selectedFile.name,
              storageId,
              tags: ['Uploaded from Job'],
              size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
            });
            finalCvId = newCvId;
          }
        } catch (err: any) {
          if (err.message?.includes("Unauthorized")) {
            alert("Authentication Error: Please ensure you have created the 'convex' JWT template in your Clerk dashboard.");
          } else {
            console.error("Upload failed", err);
          }
          setIsSaving(false);
          return;
        }
      }

      const jobData = {
        company: formData.get('company') as string,
        role: formData.get('role') as string,
        url: formData.get('url') as string,
        status: formData.get('status') as string,
        jd: formData.get('jd') as string,
        notes: formData.get('notes') as string,
        cvId: finalCvId,
        cvStorageId: finalCvStorageId,
      };

      if (activeJob) {
        await updateJob({ id: activeJob._id, ...jobData });
      } else {
        await createJob(jobData);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save job", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Delete this application?")) {
      await removeJob({ id });
    }
  };

  const filteredJobs = jobs?.filter(job => 
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <TopNav />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8">
        <header className="mb-12 pt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Good morning, Developer</h1>
            <p className="text-ink-muted text-sm max-w-lg leading-relaxed">
              Track your journey to the next great role.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-outline shrink-0">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <SignedIn>
              <button onClick={handleOpenNew} className="btn btn-primary shrink-0">
                <Plus className="w-4 h-4" />
                New Application
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-primary shrink-0">
                  Sign In to Start
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Applied', value: jobs?.length || 0, color: 'bg-surface-200' },
            { label: 'Interviewing', value: jobs?.filter(j => j.status === 'Interviewing').length || 0, color: 'bg-orange-50 text-orange-700 border border-orange-100' },
            { label: 'Offers', value: jobs?.filter(j => j.status === 'Offered').length || 0, color: 'bg-green-50 text-green-700 border border-green-100' },
            { label: 'Rejected', value: jobs?.filter(j => j.status === 'Rejected').length || 0, color: 'bg-red-50 text-red-700 border border-red-100' },
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-xl flex flex-col justify-between h-32 ${stat.color} ${!stat.color.includes('border') && 'border border-surface-200'}`}>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{stat.label}</span>
              <span className="text-4xl font-light tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </section>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input 
              type="text" 
              placeholder="Search roles or companies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-100 border border-transparent rounded-md text-sm focus:bg-white focus:border-blood-300 focus:outline-none focus:ring-2 focus:ring-blood-100 transition-all"
            />
          </div>
        </div>

        <section className="bg-white border border-surface-200 rounded-xl shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-surface-300 bg-surface-200 text-xs font-bold text-ink tracking-wider uppercase">
            <div className="col-span-4">Role & Company</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Applied Date</div>
            <div className="col-span-3">Assigned CV</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {jobs === undefined ? (
            <div className="p-20 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood-600"></div>
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="divide-y divide-surface-200">
              {filteredJobs.map((job) => {
                const cv = cvs?.find(c => c._id === job.cvId);
                return (
                  <div key={job._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center group hover:bg-surface-200/50 transition-colors cursor-pointer" onClick={() => handleEdit(job)}>
                    <div className="col-span-12 md:col-span-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-surface-200 flex items-center justify-center shrink-0 shadow-sm">
                        <div className="text-lg font-bold text-blood-600">{job.company.charAt(0)}</div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-blood-600 transition-colors truncate">{job.role}</h3>
                        <p className="text-xs text-ink-muted mt-0.5 truncate">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-6 md:col-span-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        job.status === 'Interviewing' ? 'bg-orange-100 text-orange-700' :
                        job.status === 'Offered' ? 'bg-green-100 text-green-700' :
                        job.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-surface-300 text-ink'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="col-span-6 md:col-span-2 text-sm text-ink-muted md:text-ink">
                      <span className="md:hidden font-bold text-ink-muted mr-1 uppercase text-[10px]">Date:</span>
                      {new Date(job._creationTime).toLocaleDateString()}
                    </div>
                    
                    <div className="col-span-9 md:col-span-3">
                      <div 
                        onClick={(e) => {
                          if (cv?.url) {
                            e.stopPropagation();
                            window.open(cv.url, '_blank');
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-surface-200 rounded text-xs text-ink-muted transition-colors ${cv?.url ? 'hover:border-blood-300 hover:text-blood-600' : 'opacity-50 cursor-not-allowed'}`}
                      >
                        <span className="truncate max-w-[200px] md:max-w-[140px]">
                          {cv?.name || (job.cvStorageId ? "Custom Upload" : "No CV")}
                        </span>
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                      </div>
                    </div>
                    
                    <div className="col-span-3 md:col-span-1 text-right flex justify-end transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <Dropdown 
                        align="right"
                        trigger={
                          <button className="h-9 w-9 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-300 rounded transition-all">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        }
                        items={[
                          { label: 'View / Edit', icon: <Edit className="w-4 h-4" />, onClick: () => handleEdit(job) },
                          { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => handleDelete(job._id) }
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon={BriefcaseIcon}
              title={jobs?.length === 0 ? "No applications yet" : "No results found"}
              description={jobs?.length === 0 
                ? "Start your journey by adding your first job application. We'll help you track every step."
                : `We couldn't find any applications matching "${searchQuery}".`
              }
              action={
                jobs?.length === 0 ? (
                  <>
                    <SignedIn>
                      <button onClick={handleOpenNew} className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Add your first job
                      </button>
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="btn btn-primary">
                          Sign in to start
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </>
                ) : (
                  <button onClick={() => setSearchQuery('')} className="btn btn-outline" type="button">
                    Clear search
                  </button>
                )
              }
            />
          )}
        </section>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={activeJob ? `Edit: ${activeJob.company}` : "New Application"} size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[650px]">
          <div className="p-6 overflow-y-auto border-r border-surface-200 custom-scrollbar">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Company</label>
                  <input name="company" defaultValue={activeJob?.company} required type="text" className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 transition-all" placeholder="e.g. Acme Corp" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Role</label>
                  <input name="role" defaultValue={activeJob?.role} required type="text" className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 transition-all" placeholder="e.g. Software Engineer" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">URL</label>
                  <input name="url" defaultValue={activeJob?.url} type="url" className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 transition-all" placeholder="https://..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Status</label>
                  <select name="status" defaultValue={activeJob?.status || "Pending"} className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 transition-all">
                    <option>Pending</option>
                    <option>Applied</option>
                    <option>Interviewing</option>
                    <option>Offered</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">CV Selection</label>
                <div className="flex bg-surface-100 p-1 rounded-lg border border-surface-200">
                  <button type="button" onClick={() => setCvSource('master')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${cvSource === 'master' ? 'bg-white shadow-sm text-blood-600' : 'text-ink-muted hover:text-ink'}`}>Select Master</button>
                  <button type="button" onClick={() => setCvSource('upload')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${cvSource === 'upload' ? 'bg-white shadow-sm text-blood-600' : 'text-ink-muted hover:text-ink'}`}>Upload New</button>
                </div>

                {cvSource === 'master' ? (
                  <select 
                    value={selectedCv} 
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedCv(id);
                      if (id) {
                        const cv = cvs?.find(c => c._id === id);
                        if (cv?.url) setPreviewUrl(cv.url);
                      } else {
                        setPreviewUrl(null);
                      }
                    }} 
                    className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 transition-all"
                  >
                    <option value="">Select from library...</option>
                    {cvs?.map(cv => <option key={cv._id} value={cv._id}>{cv.name}</option>)}
                  </select>
                ) : (
                  <div className="space-y-3 animate-in slide-in-from-top-1">
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-surface-200 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-100 hover:bg-surface-200 hover:border-blood-300 transition-all cursor-pointer group">
                      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
                      <Plus className="w-6 h-6 text-ink-muted group-hover:text-blood-600 mb-1" />
                      <p className="text-xs font-medium">{selectedFile ? selectedFile.name : 'Click to upload custom CV'}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={saveToMaster} onChange={(e) => setSaveToMaster(e.target.checked)} className="w-4 h-4 rounded border-surface-300 text-blood-600 cursor-pointer" />
                      <span className="text-xs text-ink-muted group-hover:text-ink transition-colors font-medium">Save this CV to Master library</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Job Description</label>
                <textarea name="jd" defaultValue={activeJob?.jd} className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 transition-all min-h-[120px] leading-relaxed" placeholder="Paste the JD here..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Personal Notes</label>
                <textarea name="notes" defaultValue={activeJob?.notes} className="w-full px-3 py-2 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 transition-all min-h-[80px]" placeholder="Any specific thoughts?" />
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-surface-bg py-2 border-t border-surface-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost" disabled={isSaving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : null}
                  {activeJob ? "Update Application" : "Save Application"}
                </button>
              </div>
            </form>
          </div>

          <div className="hidden lg:flex bg-surface-100 p-10 items-center justify-center relative overflow-hidden h-full border-l border-surface-200">
            {previewUrl ? (
              <iframe src={previewUrl} className="w-full h-full bg-white rounded shadow-2xl border-none" title="PDF Preview" />
            ) : (
              <div className="bg-white border border-surface-200 rounded shadow-xl aspect-[1/1.414] w-full max-w-[320px] p-10 flex flex-col gap-4 animate-pulse">
                <div className="h-6 w-40 bg-surface-100 rounded" />
                <div className="h-2 w-full bg-surface-100 rounded" />
                <div className="h-2 w-full bg-surface-100 rounded" />
                <div className="h-2 w-3/4 bg-surface-100 rounded" />
                <div className="mt-auto text-center py-4"><p className="text-[10px] uppercase tracking-widest text-ink-muted opacity-30">Waiting for local asset</p></div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
