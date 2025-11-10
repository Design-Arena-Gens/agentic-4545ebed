import { PlatformProvider } from './components/PlatformContext';
import Dashboard from './components/Dashboard';

export default function HomePage() {
  return (
    <PlatformProvider>
      <Dashboard />
    </PlatformProvider>
  );
}
