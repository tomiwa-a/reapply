import React, { useState, useRef } from 'react';
import { Search, UploadCloud, MoreVertical, FileText, X, Plus, Eye, Trash2, Download } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Modal } from '../components/ui/Modal';
import { Dropdown } from '../components/ui/Dropdown';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { EmptyState } from '../components/ui/EmptyState';
import { FileText as FileTextIcon, UploadCloud as UploadIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export function MasterCVs() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingCv, setViewingCv] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex Hooks
  const cvs = useQuery(api.cvs.listCvs);
  const removeCv = useMutation(api.cvs.removeCv);
  const generateUploadUrl = useMutation(api.cvs.generateUploadUrl);
  const saveCv = useMutation(api.cvs.saveCv);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleDelete = async (id: any, storageId: any) => {
    if (confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      await removeCv({ id, storageId });
    }
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();

      await saveCv({
        name: selectedFile.name,
        storageId,
        tags,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      });

      handleCloseUpload();
    } catch (error: any) {
      if (error.message?.includes("Unauthorized")) {
        alert("Authentication Error: Please ensure you have created the 'convex' JWT template in your Clerk dashboard.");
      } else {
        console.error("Upload failed", error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseUpload = () => {
    setIsUploadModalOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setTags([]);
    setIsUploading(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredCvs = cvs?.filter(cv => {
    const matchesSearch = cv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => cv.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(cvs?.flatMap(cv => cv.tags) || []));

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
          <SignedIn>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary shrink-0"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New CV
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary shrink-0">
                Sign In to Upload
              </button>
            </SignInButton>
          </SignedOut>
        </header>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input 
                type="text" 
                placeholder="Search CVs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-100 border border-transparent rounded-md text-sm focus:bg-white focus:border-blood-300 focus:outline-none focus:ring-2 focus:ring-blood-100 transition-all"
              />
            </div>
            {Boolean(selectedTags.length || searchQuery) && (
              <button 
                onClick={() => { setSelectedTags([]); setSearchQuery(''); }}
                className="text-xs font-medium text-blood-600 hover:text-blood-800 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>
          
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag) 
                      ? 'bg-blood-100 text-blood-700 border border-blood-200' 
                      : 'bg-surface-200 text-ink-muted hover:bg-surface-300 border border-transparent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {cvs === undefined ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood-600"></div>
          </div>
        ) : filteredCvs && filteredCvs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCvs.map((cv) => (
              <div key={cv._id} className="bg-white border border-surface-200 rounded-xl p-5 hover:border-blood-300 transition-colors group relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded bg-surface-100 flex items-center justify-center text-ink-muted group-hover:bg-blood-50 group-hover:text-blood-600 transition-colors cursor-pointer" onClick={() => setViewingCv(cv)}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dropdown 
                      align="right"
                      trigger={
                        <button className="text-ink-muted hover:text-ink p-1 -mr-2 bg-surface-100/0 hover:bg-surface-100 rounded transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      }
                      items={[
                        { label: 'View Fullscreen', icon: <Eye className="w-4 h-4" />, onClick: () => setViewingCv(cv) },
                        { 
                          label: 'Download PDF', 
                          icon: <Download className="w-4 h-4" />, 
                          onClick: () => window.open(cv.url, '_blank') 
                        },
                        { label: 'Delete Document', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => handleDelete(cv._id, cv.storageId) }
                      ]}
                    />
                  </div>
                </div>
                
                <h3 className="font-semibold text-sm mb-1 truncate cursor-pointer hover:text-blood-600 transition-colors" title={cv.name} onClick={() => setViewingCv(cv)}>
                  {cv.name}
                </h3>
                <p className="text-xs text-ink-muted mb-4">{cv.role || "Version 1.0"} • {cv.size || "1.0 MB"} • {new Date(cv._creationTime).toLocaleDateString()}</p>
                
                <div className="flex items-center gap-2">
                  {cv.tags.map(tag => (
                    <button 
                      key={tag} 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(tag);
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide transition-colors ${
                        selectedTags.includes(tag) 
                          ? 'bg-blood-100 text-blood-700' 
                          : 'bg-surface-100 text-ink-muted hover:bg-surface-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={FileTextIcon}
            title={cvs?.length === 0 ? "Library is empty" : "No results found"}
            description={cvs?.length === 0 
              ? "Upload your base resumes here to link them to your applications for better tracking."
              : `We couldn't find any CVs matching your active filters.`
            }
            action={
              cvs?.length === 0 ? (
                <>
                  <SignedIn>
                    <button 
                      onClick={() => setIsUploadModalOpen(true)}
                      className="btn btn-primary"
                    >
                      <UploadIcon className="w-4 h-4" />
                      Upload your first CV
                    </button>
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="btn btn-primary">
                        Sign in to upload
                      </button>
                    </SignInButton>
                  </SignedOut>
                </>
              ) : (
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedTags([]); }}
                  className="btn btn-outline"
                >
                  Clear all filters
                </button>
              )
            }
          />
        )}
      </main>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUpload}
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
                  accept=".pdf" 
                  onChange={handleFileChange}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-surface-200 rounded-lg p-8 flex flex-col items-center justify-center bg-surface-100 hover:bg-surface-200 hover:border-blood-300 transition-all cursor-pointer group"
                >
                  <UploadCloud className="w-10 h-10 text-ink-muted group-hover:text-blood-600 transition-colors mb-2" />
                  <p className="text-sm font-medium">{selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}</p>
                  <p className="text-xs text-ink-muted mt-1">PDF only for real-time preview</p>
                </div>
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
                    className="flex-1 px-3 py-1.5 bg-surface-100 border border-surface-200 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blood-400 focus:ring-1 focus:ring-blood-400 transition-all" 
                    placeholder="Add tag..." 
                  />
                  <button onClick={addTag} type="button" className="p-2 bg-surface-200 hover:bg-surface-300 rounded-md transition-colors text-ink">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-surface-200 mt-6 bg-surface-bg sticky bottom-0">
              <button 
                onClick={handleCloseUpload} 
                className="btn btn-ghost"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                className={`btn btn-primary ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : 'Save to Library'}
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="bg-surface-100 p-4 lg:p-8 flex items-center justify-center relative overflow-hidden h-full">
            {previewUrl ? (
              <div className="w-full h-full bg-white rounded shadow-2xl overflow-hidden border border-surface-200 animate-in zoom-in-95 duration-300">
                <iframe 
                  src={previewUrl} 
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="w-full max-w-[320px] bg-white border border-surface-200 rounded-sm shadow-2xl aspect-[1/1.414] overflow-hidden relative group-hover:scale-[1.01] transition-transform duration-500 p-10 flex flex-col gap-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <div className="h-5 w-40 bg-surface-100 rounded" />
                    <div className="h-2 w-24 bg-surface-100 rounded" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-2 w-full bg-surface-100 rounded" />
                  ))}
                </div>
                <div className="mt-auto text-center border-t border-surface-100 pt-4">
                   <p className="text-[10px] font-bold text-ink-muted/30 uppercase tracking-[0.2em]">Contextual Preview Engine</p>
                </div>
              </div>
            )}
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
        <div className="flex flex-col items-center gap-6 py-4 h-[70vh]">
          {viewingCv?.url ? (
             <iframe 
               src={viewingCv.url} 
               className="w-full h-full border-none shadow-2xl rounded"
               title={`CV View ${viewingCv.name}`}
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-100 text-ink-muted italic">
              Generating viewing link...
            </div>
          )}
          
          <div className="flex items-center gap-4 w-full justify-center shrink-0">
            <button 
              className="btn btn-outline gap-2"
              onClick={() => window.open(viewingCv.url, '_blank')}
            >
              <Download className="w-4 h-4" />
              Open Original
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
