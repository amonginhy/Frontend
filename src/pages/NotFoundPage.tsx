import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cake, Home } from 'lucide-react';
import { Button, Container } from '@shared/ui';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="min-h-[70vh] grid place-items-center text-center py-20">
        <div className="max-w-md">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-burgundy-600 grid place-items-center text-cream-50 mb-6">
            <Cake size={28} />
          </div>
          <h1 className="text-display text-5xl font-semibold text-burgundy-700">404</h1>
          <p className="text-ink-500 mt-2">
            That recipe is missing from our pantry. Let's get you back to fresh bakes.
          </p>
          <div className="mt-6 flex justify-center">
            <Button leftIcon={<Home size={16} />} onClick={() => navigate('/')}>
              Back to home
            </Button>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
