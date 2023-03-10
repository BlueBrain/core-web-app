'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Result } from 'antd';

function AuthSuccessView() {
  const [countdown, setCountdown] = useState<number>(5);

  // It is expected this page will be opened in a separate window/tab or in an iframe.
  const isWindow = !!window.opener; // not an iframe

  const subTitle = isWindow
    ? `You can close this window now, otherwise it will be automatically closed in ${countdown} s.`
    : null;

  useEffect(() => {
    const target = window.opener ?? window.parent;
    target.postMessage('bbpWorkflowAuthReady');
  }, []);

  useEffect(() => {
    if (countdown === 0) window.close();

    if (!isWindow) return;

    setTimeout(() => setCountdown(countdown - 1), 1000);
  }, [countdown, setCountdown, isWindow]);

  return (
    <Result
      status="success"
      title="Successfully provided an authorisation to BBP Workflow"
      subTitle={subTitle}
      extra={
        isWindow
          ? [
              <Button type="primary" key="close" onClick={() => window.close()}>
                Close this window
              </Button>,
            ]
          : null
      }
    />
  );
}

// Disable SSR as the component requires window object.
const AuthSuccessViewNoSSR = dynamic(() => Promise.resolve(AuthSuccessView), { ssr: false });

export default function AuthSuccessPage() {
  return <AuthSuccessViewNoSSR />;
}
