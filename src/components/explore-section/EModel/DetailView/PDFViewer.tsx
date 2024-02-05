'use client';

import { useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAccessToken } from '@/components/experiment-interactive/ExperimentInteractive/hooks/current-campaign-descriptor';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

type Props = {
  url: string;
  name: string;
};

const options = {
  standardFontDataUrl: '/standard_fonts/',
};

export default function PDFViewer({ url, name }: Props) {
  const [totalPages, setNumPages] = useState<number>();
  const token = useAccessToken();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const pdfFile = useMemo(
    () => ({
      url,
      httpHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }),
    [url, token]
  );

  return (
    <div className="mt-4 flex flex-col items-center">
      <h5 className="p-3 text-2xl font-semibold">{name}</h5>
      <Document options={options} file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(totalPages), (el, index) => (
          <>
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={1200}
              className="border border-primary-8"
            />
            <div className="text-center">
              Page {index + 1} of {totalPages}
            </div>
          </>
        ))}
      </Document>
    </div>
  );
}
