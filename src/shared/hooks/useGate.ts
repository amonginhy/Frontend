import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore, authSelectors } from '@app/store/auth.store';
import { useAuthModalStore } from '@app/store/auth-modal.store';

/**
 * Wraps a callback so it only runs when the user is authenticated.
 * If not, opens the AuthRequiredModal with the supplied reason.
 */
export function useGate() {
  const isAuthed = useAuthStore(authSelectors.isAuthenticated);
  const show = useAuthModalStore((s) => s.show);
  const location = useLocation();

  return useCallback(
    (reason: string, action: () => void) => {
      if (isAuthed) {
        action();
        return true;
      }
      show(reason, location.pathname + location.search);
      return false;
    },
    [isAuthed, show, location.pathname, location.search],
  );
}
