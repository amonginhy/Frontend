import { create } from 'zustand';

interface AuthModalState {
  open: boolean;
  reason: string;
  redirectAfter: string | null;
  show: (reason?: string, redirectAfter?: string | null) => void;
  hide: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  open: false,
  reason: 'Sign in to continue',
  redirectAfter: null,
  show: (reason = 'Sign in to continue', redirectAfter = null) =>
    set({ open: true, reason, redirectAfter: redirectAfter ?? null }),
  hide: () => set({ open: false }),
}));
