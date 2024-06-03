import { useState, useEffect, PropsWithChildren } from 'react';

export default function ClientOnly({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{mounted && children}</>;
}
