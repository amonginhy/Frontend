import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, ChevronRight, FileText, MapPin, ShieldCheck, X } from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, StatCard } from '@shared/ui';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

interface Application {
  id: string;
  bakeryName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  submitted: string;
  documents: { label: string; verified: boolean }[];
  notes?: string;
}

const APPLICATIONS: Application[] = [
  {
    id: 'a1',
    bakeryName: 'Tropical Crumbs',
    ownerName: 'Aisha Mugisha',
    email: 'hello@tropicalcrumbs.ug',
    phone: '+256 700 555 011',
    city: 'Wakiso',
    submitted: '2 hours ago',
    documents: [
      { label: 'Business license', verified: true },
      { label: 'Food handler certificate', verified: true },
      { label: 'Tax ID', verified: false },
    ],
    notes: 'Specializes in tropical fruit cakes and tea-time pastries.',
  },
  {
    id: 'a2',
    bakeryName: 'Soft Loaves',
    ownerName: 'Peter Wamala',
    email: 'peter@softloaves.ug',
    phone: '+256 770 555 022',
    city: 'Mukono',
    submitted: '5 hours ago',
    documents: [
      { label: 'Business license', verified: true },
      { label: 'Food handler certificate', verified: true },
      { label: 'Tax ID', verified: true },
    ],
    notes: 'Artisan sourdough and brioche.',
  },
  {
    id: 'a3',
    bakeryName: 'Cocoa Studio',
    ownerName: 'Mariam Kasozi',
    email: 'team@cocoastudio.ug',
    phone: '+256 783 555 033',
    city: 'Ntinda, Kampala',
    submitted: 'Yesterday',
    documents: [
      { label: 'Business license', verified: false },
      { label: 'Food handler certificate', verified: true },
      { label: 'Tax ID', verified: false },
    ],
  },
  {
    id: 'a4',
    bakeryName: 'Pearl Sweets',
    ownerName: 'Daniel Nsubuga',
    email: 'hello@pearlsweets.ug',
    phone: '+256 705 555 044',
    city: 'Entebbe',
    submitted: '2 days ago',
    documents: [
      { label: 'Business license', verified: true },
      { label: 'Food handler certificate', verified: true },
      { label: 'Tax ID', verified: true },
    ],
    notes: 'Wedding and celebration specialist.',
  },
];

export default function AdminApprovalsPage() {
  const [items, setItems] = useState<Application[]>(APPLICATIONS);
  const [activeId, setActiveId] = useState<string>(APPLICATIONS[0].id);

  const active = items.find((a) => a.id === activeId);

  const approve = (id: string) => {
    const app = items.find((a) => a.id === id);
    setItems((prev) => prev.filter((a) => a.id !== id));
    if (items.length > 1) {
      const next = items.find((a) => a.id !== id);
      if (next) setActiveId(next.id);
    }
    toast.success('Vendor approved', `${app?.bakeryName} is now live on the marketplace.`);
  };

  const reject = (id: string) => {
    const app = items.find((a) => a.id === id);
    setItems((prev) => prev.filter((a) => a.id !== id));
    if (items.length > 1) {
      const next = items.find((a) => a.id !== id);
      if (next) setActiveId(next.id);
    }
    toast.info('Application rejected', `${app?.bakeryName} was sent a follow-up.`);
  };

  const verifiedReady = items.filter((a) => a.documents.every((d) => d.verified)).length;
  const docsPending = items.filter((a) => a.documents.some((d) => !d.verified)).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Approvals
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Vendor applications
          </h1>
          <p className="text-ink-500 mt-1">
            Review documents, verify credentials, and onboard new bakeries.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending" value={items.length} icon={<ShieldCheck size={18} />} tone="cream" />
        <StatCard label="Verified & ready" value={verifiedReady} delta={4.2} tone="accent" />
        <StatCard label="Docs incomplete" value={docsPending} tone="burgundy" />
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck size={20} />}
          title="Nothing to review"
          description="You're all caught up. New applications will show up here as they come in."
        />
      ) : (
        <div className="grid lg:grid-cols-[340px_1fr] gap-4">
          <aside className="bg-white rounded-3xl border border-cream-100 shadow-soft p-3 self-start">
            {items.map((a) => {
              const ready = a.documents.every((d) => d.verified);
              return (
                <button
                  key={a.id}
                  onClick={() => setActiveId(a.id)}
                  className={cn(
                    'w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-colors',
                    activeId === a.id
                      ? 'bg-burgundy-600 text-cream-50'
                      : 'hover:bg-cream-100',
                  )}
                >
                  <Avatar name={a.bakeryName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{a.bakeryName}</p>
                    <p
                      className={cn(
                        'text-xs truncate',
                        activeId === a.id ? 'text-cream-200/80' : 'text-ink-400',
                      )}
                    >
                      {a.city} · {a.submitted}
                    </p>
                  </div>
                  <Badge tone={ready ? 'green' : 'amber'}>{ready ? 'Ready' : 'Pending'}</Badge>
                  <ChevronRight
                    size={14}
                    className={cn(
                      activeId === a.id ? 'text-cream-200/80' : 'text-ink-300',
                    )}
                  />
                </button>
              );
            })}
          </aside>

          {active && (
            <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-display text-2xl font-semibold text-burgundy-700">
                    {active.bakeryName}
                  </h2>
                  <p className="text-sm text-ink-500 mt-1 inline-flex items-center gap-1">
                    <MapPin size={12} /> {active.city} · submitted {active.submitted}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    leftIcon={<X size={14} />}
                    onClick={() => reject(active.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="dark"
                    leftIcon={<Check size={14} />}
                    onClick={() => approve(active.id)}
                    disabled={!active.documents.every((d) => d.verified)}
                  >
                    Approve
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="border border-cream-200 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold mb-1">
                    Owner
                  </p>
                  <p className="font-semibold">{active.ownerName}</p>
                  <p className="text-xs text-ink-500">{active.email}</p>
                  <p className="text-xs text-ink-500">{active.phone}</p>
                </div>
                <div className="border border-cream-200 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold mb-1">
                    Profile notes
                  </p>
                  <p className="text-sm text-ink-700">
                    {active.notes ?? 'No additional notes provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 border border-cream-200 rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold mb-3">
                  Documents
                </p>
                <ul className="space-y-2">
                  {active.documents.map((d) => (
                    <li
                      key={d.label}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-cream-50"
                    >
                      <span className="inline-flex items-center gap-2 text-sm">
                        <FileText size={14} className="text-ink-500" /> {d.label}
                      </span>
                      <Badge tone={d.verified ? 'green' : 'amber'}>
                        {d.verified ? 'Verified' : 'Awaiting'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
