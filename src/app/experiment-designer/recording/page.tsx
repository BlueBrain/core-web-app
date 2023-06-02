'use client';

import { useMemo } from 'react';
import { Col, Row } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai/index';

import { Params, Visualization } from '@/components/experiment-designer/recording';
import {
  extractTargetNamesFromSection,
  getFocusedAtom,
} from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

const SECTION_NAME = 'recording';

export default function RecordingPage() {
  const focusedAtom = useMemo(() => getFocusedAtom(SECTION_NAME), []);
  const inputSectionParams = useAtomValue(focusedAtom);

  const targetsToDisplay = useMemo(
    () => extractTargetNamesFromSection(inputSectionParams),
    [inputSectionParams]
  );

  return (
    <Row className="h-full">
      <Col span={8}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <Params focusedAtom={focusedAtom} />
        </ErrorBoundary>
      </Col>
      <Col span={16}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <Visualization targetsToDisplay={targetsToDisplay} />
        </ErrorBoundary>
      </Col>
    </Row>
  );
}
