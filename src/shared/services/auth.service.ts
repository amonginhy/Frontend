import type { User } from '@shared/types';

const wait = <T>(v: T, ms = 400) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const authService = {
  signIn: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
    const role: User['role'] = email.includes('admin')
      ? 'admin'
      : email.includes('vendor')
        ? 'vendor'
        : 'customer';
    return wait({
      user: {
        id: 'u_session',
        name: email.split('@')[0],
        email,
        role,
      },
      token: 'demo-jwt-token',
    });
  },
  signUp: async (email: string, name: string): Promise<{ user: User; token: string }> =>
    wait({ user: { id: 'u_new', name, email, role: 'customer' }, token: 'demo-jwt-token' }),
};
