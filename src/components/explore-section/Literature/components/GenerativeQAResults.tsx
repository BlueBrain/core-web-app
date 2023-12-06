'use client';

import { useLiteratureDataSource } from '../useContextualLiteratureContext';
import withStreamResult from './QAResult/ResultWithStream';

export default function QAResultList() {
  const dataSource = useLiteratureDataSource();

  return (
    <div
      id="result-container"
      className="w-full h-full max-h-screen transition-height duration-700 ease-linear"
    >
      <div className="flex-1 w-full flex flex-col-reverse h-full overflow-auto scroll-smooth">
        <ul className="flex flex-col items-center justify-start max-w-4xl w-full p-4 mx-auto list-none">
          {dataSource.map(({ id, ...rest }) =>
            withStreamResult({
              id,
              current: rest,
            })
          )}
        </ul>
      </div>
    </div>
  );
}
