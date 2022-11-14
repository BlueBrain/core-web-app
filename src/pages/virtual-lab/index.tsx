import PlaceHolder from '@/components/placeholder';
import Theme from '@/styles/theme.module.css';

export default function BrainFactory() {
  return (
    <PlaceHolder className={Theme.colorPrimary7}>
      <h1>Virtual Lab</h1>
    </PlaceHolder>
  );
}
