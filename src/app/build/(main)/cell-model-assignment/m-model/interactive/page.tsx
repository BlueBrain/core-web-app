import InteractiveBrayns from '@/components/InteractiveBrayns';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

export default function InteractivePage() {
  useLiteratureCleanNavigate();
  return <InteractiveBrayns />;
}
