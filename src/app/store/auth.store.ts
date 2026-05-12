import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/types';

export interface CustomerSignupInput {
  name: string;
  email: string;
  phone?: string;
}

export interface VendorSignupInput {
  bakeryName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  signIn: (
    email: string,
    password: string,
    role?: User['role'],
  ) => Promise<User>;
  signUpCustomer: (input: CustomerSignupInput) => Promise<User>;
  signUpVendor: (input: VendorSignupInput) => Promise<User>;
  signOut: () => void;
  signInAsDemo: (role?: User['role']) => User;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demoProfiles: Record<User['role'], User> = {
  customer: {
    id: 'u_customer',
    name: 'Amara Bennett',
    email: 'amara@edenscrunchbox.com',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
    role: 'customer',
  },
  vendor: {
    id: 'u_vendor',
    name: 'Olive & Oak Bakery',
    email: 'team@oliveandoak.co',
    avatar:
      'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
    role: 'vendor',
  },
  admin: {
    id: 'u_admin',
    name: "Eden's CrunchBox HQ",
    email: 'ops@edenscrunchbox.com',
    role: 'admin',
  },
};

const inferRoleFromEmail = (email: string): User['role'] => {
  const lower = email.toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('vendor') || lower.includes('bakery') || lower.includes('baker'))
    return 'vendor';
  return 'customer';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      signIn: async (email, _password, role) => {
        await wait(450);
        const resolvedRole = role ?? inferRoleFromEmail(email);
        const base = demoProfiles[resolvedRole];
        const user: User = {
          ...base,
          email,
          name: base.name,
          role: resolvedRole,
        };
        set({ user, token: 'demo-jwt-token' });
        return user;
      },
      signUpCustomer: async (input) => {
        await wait(550);
        const user: User = {
          id: `u_${Date.now()}`,
          name: input.name,
          email: input.email,
          role: 'customer',
        };
        set({ user, token: 'demo-jwt-token' });
        return user;
      },
      signUpVendor: async (input) => {
        await wait(650);
        const user: User = {
          id: `v_${Date.now()}`,
          name: input.bakeryName,
          email: input.email,
          role: 'vendor',
        };
        set({ user, token: 'demo-jwt-token' });
        return user;
      },
      signOut: () => set({ user: null, token: null }),
      signInAsDemo: (role = 'customer') => {
        const user = demoProfiles[role];
        set({ user, token: 'demo-jwt-token' });
        return user;
      },
    }),
    {
      name: 'sweetly:auth',
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

export const authSelectors = {
  isAuthenticated: (s: AuthState) => !!s.user && !!s.token,
  role: (s: AuthState) => s.user?.role,
};
