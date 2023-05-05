'use client';

import { useMemo } from 'react';
import { Col, Row } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import { Params, Visualization } from '@/components/experiment-designer/recording';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function RecordingPage() {
  const sectionName = 'recording';
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);

  return (
    <Row className="h-full">
      <Col span={8}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <Params focusedAtom={focusedAtom} />
        </ErrorBoundary>
      </Col>
      <Col span={16}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <Visualization focusedAtom={focusedAtom} />
        </ErrorBoundary>
      </Col>
    </Row>
  );
}
