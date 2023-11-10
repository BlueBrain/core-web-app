import AuthWrapper from '@/components/AuthWrapper';
import Entrypoint from '@/components/Entrypoint';

export default function RootPage() {
  return (
    <AuthWrapper>
      <Entrypoint />
    </AuthWrapper>
  );
}
