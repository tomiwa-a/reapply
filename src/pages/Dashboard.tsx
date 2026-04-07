import React from 'react';
import { Plus, Search, Filter, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';

export function Dashboard() {
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
            <button className="btn btn-primary shrink-0">
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

        {/* Board / Table Layout (Placeholder) */}
        <section className="bg-surface-100 border border-surface-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-surface-200 bg-surface-200/50 text-xs font-semibold text-ink-muted tracking-wider uppercase">
            <div className="col-span-4">Role & Company</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Applied Date</div>
            <div className="col-span-3">Assigned CV</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {/* List Items */}
          <div className="divide-y divide-surface-200">
            {[
              { role: 'Senior Frontend Engineer', company: 'Vercel', status: 'Interviewing', date: 'Oct 12, 2026', cv: 'Master_CV_React_v2.pdf', badge: 'bg-orange-100 text-orange-700' },
              { role: 'Full Stack Developer', कंपनी: 'Stripe', status: 'Applied', date: 'Oct 15, 2026', cv: 'Master_CV_Fullstack.pdf', badge: 'bg-surface-300 text-ink' },
              { role: 'Product Engineer', company: 'Linear', status: 'Take-home', date: 'Oct 10, 2026', cv: 'Master_CV_React_v2.pdf', badge: 'bg-blue-100 text-blue-700' },
            ].map((job, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4 p-4 items-center group hover:bg-surface-200/50 transition-colors cursor-pointer">
                <div className="col-span-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-surface-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {/* Placeholder Logo */}
                    <div className="text-lg font-bold text-blood-600">{job.company?.charAt(0) || job.role.charAt(0)}</div>
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
                
                <div className="col-span-1 text-right flex justify-end">
                  <button className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface-300 rounded opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
