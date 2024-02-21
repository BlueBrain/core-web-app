'use client';

import { useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Divider } from 'antd';
import { useAccessToken } from '@/components/experiment-interactive/ExperimentInteractive/hooks/current-campaign-descriptor';
import styles from './styles.module.css';
import { classNames } from '@/util/utils';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

type Props = {
  url: string;
  type: string;
};

const options = {
  standardFontDataUrl: '/standard_fonts/',
};

export default function PDFViewer({ url, type }: Props) {
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
      <h2 className="p-3 text-2xl font-bold text-primary-8">{type}</h2>
      <Document
        options={options}
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className={classNames('w-full', styles.pdf)}
      >
        {Array.from(new Array(totalPages), (el, index) => (
          <>
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="border border-primary-8"
            />
            <div className="text-center">
              Page {index + 1} of {totalPages}
            </div>
          </>
        ))}
      </Document>
      <Divider />
    </div>
  );
}
