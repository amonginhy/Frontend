import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button, Container } from '@shared/ui';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="min-h-[70vh] grid place-items-center text-center py-20">
        <div className="max-w-md">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-burgundy-600 grid place-items-center text-cream-50 mb-6">
            <Lock size={28} />
          </div>
          <h1 className="text-display text-4xl font-semibold text-burgundy-700">
            You don't have access to this area
          </h1>
          <p className="text-ink-500 mt-2">
            Different parts of Eden&apos;s CrunchBox are reserved for customers, bakers, and admins. If you
            believe this is an error, please contact support.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Link to="/">
              <Button>Back to home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
