import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function BrainFactoryTabs({ children }: Props) {
  return (
    <div className="flex">
      <button type="button" className="flex-auto text-blue-7 h-12" style={{ marginRight: '1px' }}>
        Cell composition
      </button>
      <button
        type="button"
        className="flex-auto bg-blue-7 text-white"
        style={{ marginRight: '1px' }}
      >
        Cell model assignment
      </button>
      <button
        type="button"
        className="flex-auto bg-blue-7 text-white"
        style={{ marginRight: '1px' }}
      >
        Connectome definition
      </button>
      <button
        type="button"
        className="flex-auto bg-blue-7 text-white"
        style={{ marginRight: '1px' }}
      >
        Connection model assignment
      </button>
      {children}
    </div>
  );
}
