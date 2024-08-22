import { CSSProperties } from 'react';
import LoadingWheel from '@/components/icons/LoadingWheel';
import GreyRing from '@/components/icons/LoadingWheel/GreyRing';

interface Props {
  style?: CSSProperties;
  text?: string;
  noResults?: boolean;
}

function CentralLoadingWheel({
  style = { display: 'table', width: '100%', height: '100vh' },
  text = '',
  noResults = false,
}: Props) {
  const IconComponent = noResults ? GreyRing : LoadingWheel;

  return (
    <div
      style={{
        ...style,
        textAlign: 'center',
        paddingTop: 'calc(15vh - 27px)',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <IconComponent style={{ height: '300px' }} />
        {text && (
          <div
            className="max-w-[25rem] text-2xl font-semibold text-primary-9"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
}

export default CentralLoadingWheel;
