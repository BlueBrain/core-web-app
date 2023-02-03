import AuthWrapper from '@/components/AuthWrapper';
import Home from '@/components/Home';

export default function RootPage() {
  return (
    <AuthWrapper>
      <Home />
    </AuthWrapper>
  );
}
