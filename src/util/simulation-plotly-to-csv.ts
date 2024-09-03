import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import { PlotData, PlotDataEntry } from '@/services/bluenaas-single-cell/types';

export function getPlotlyAsCsv(trace: PlotDataEntry) {
  const csvContent = `time[ms],voltage[mV]\n${trace.x.map((x, i) => `${x},${trace.y[i]}`).join('\n')}`;
  return csvContent;
}

export function exportSimulationPlotlyToCsv(trace: PlotDataEntry) {
  const blob = new Blob([getPlotlyAsCsv(trace)], { type: 'text/csv;charset=utf-8' });
  return saveAs(blob, `${trace.name}.csv`);
}

export async function exportSingleSimulationResultAsZip({
  name,
  type,
  result,
}: {
  name: string;
  type: 'stimulus' | 'simulation';
  result: PlotData;
}) {
  const zip = new JSZip();
  const folder = zip.folder(name);
  if (folder) {
    result.forEach((trace) => {
      folder.file(
        `${type === 'stimulus' ? 'stimulus' : trace.recording}_${trace.name}.csv`,
        getPlotlyAsCsv(trace)
      );
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${name}.zip`);
  }
}

export async function exportSimulationResultsAsZip({
  name,
  result,
}: {
  name: string;
  result: Record<string, PlotData>;
}) {
  const zip = new JSZip();
  for (const [folderName, traces] of Object.entries(result)) {
    const folder = zip.folder(folderName);
    if (folder) {
      traces.forEach((trace) => {
        folder.file(`${trace.recording}_${trace.name}.csv`, getPlotlyAsCsv(trace));
      });
    }
  }
  if (Object.keys(zip.files).length) {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${name}.zip`);
  }
}
