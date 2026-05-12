import { QueryProvider } from './providers/QueryProvider';
import { AppRouter } from './router/AppRouter';

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}
