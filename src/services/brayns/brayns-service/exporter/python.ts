'use client';

import { saveAs } from 'file-saver';
import BOILERPLATE from './boilerplate.py';

export function exportPythonScriptForBraynsRecordedQueries(
  list: Array<{
    entryPoint: string;
    param?: unknown;
  }>,
  filename = 'debug.py'
) {
  const code = `${BOILERPLATE}

process([
    ${list
      .map(
        (query) =>
          `["${query.entryPoint}", json.loads("""${JSON.stringify(query.param ?? null)}""")]`
      )
      .join(',\n    ')}
])
`;
  const file = new File([code], filename, {
    type: 'application/python',
  });
  saveAs(file, filename);
}
