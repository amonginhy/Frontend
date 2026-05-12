import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '@shared/ui';
import { useAuthModalStore } from '@app/store/auth-modal.store';

export function AuthRequiredModal() {
  const { open, reason, redirectAfter, hide } = useAuthModalStore();
  const navigate = useNavigate();

  const goTo = (path: '/login' | '/signup') => {
    hide();
    navigate(path, { state: { from: redirectAfter } });
  };

  return (
    <Modal open={open} onClose={hide} title="Sign in to continue" size="sm">
      <div className="flex flex-col items-center text-center gap-4 pb-2">
        <div className="h-14 w-14 rounded-2xl bg-cream-100 grid place-items-center text-burgundy-700">
          <Lock size={22} />
        </div>
        <p className="text-ink-500 text-sm leading-relaxed max-w-sm">{reason}</p>
        <div className="flex flex-col sm:flex-row gap-2 w-full pt-2">
          <Button variant="outline" block onClick={() => goTo('/login')}>
            Login
          </Button>
          <Button block onClick={() => goTo('/signup')}>
            Create account
          </Button>
        </div>
        <button
          onClick={hide}
          className="text-xs text-ink-400 hover:text-burgundy-700 mt-1"
        >
          Keep browsing
        </button>
      </div>
    </Modal>
  );
}
