import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore, type ToastTone } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

const toneMap: Record<ToastTone, { icon: JSX.Element; cls: string }> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    cls: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  error: {
    icon: <XCircle size={18} />,
    cls: 'bg-rose-50 border-rose-200 text-rose-800',
  },
  info: {
    icon: <Info size={18} />,
    cls: 'bg-sky-50 border-sky-200 text-sky-800',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    cls: 'bg-amber-50 border-amber-200 text-amber-800',
  },
};

export function Toaster() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
      <AnimatePresence>
        {items.map((t) => {
          const tone = toneMap[t.tone];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className={cn(
                'pointer-events-auto rounded-2xl border shadow-lift p-3 flex items-start gap-3',
                tone.cls,
              )}
              role="status"
            >
              <span className="shrink-0 mt-0.5">{tone.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
                {t.description && (
                  <p className="text-xs mt-0.5 opacity-80">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
