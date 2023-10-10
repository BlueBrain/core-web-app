import { Divider } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function MEModelView() {
  return (
    <div className="h-[80vh] overflow-auto p-6">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <div>ME-Model information</div>
        </DefaultLoadingSuspense>
      </ErrorBoundary>
      <Divider />
    </div>
  );
}
