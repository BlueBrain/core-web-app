'use client';

import { useMemo } from 'react';
import { Col, Row } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import { ExpDesignerSectionName } from '@/types/experiment-designer';
import { Params, Visualization } from '@/components/experiment-designer/imaging';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

const SECTION_NAME: ExpDesignerSectionName = 'imaging';

export default function ImagingPage() {
  const focusedAtom = useMemo(() => getFocusedAtom(SECTION_NAME), []);

  return (
    <Row className="h-full">
      <Col span={8}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <Params focusedAtom={focusedAtom} />
        </ErrorBoundary>
      </Col>
      <Col span={16}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <Visualization sectionName={SECTION_NAME} />
        </ErrorBoundary>
      </Col>
    </Row>
  );
}
