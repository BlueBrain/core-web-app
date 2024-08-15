'use client';

import Image from 'next/image';
import { Fragment, useMemo, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Divider, Skeleton, Empty } from 'antd';
import { AnalysisType } from './types';
import { getSession } from '@/authFetch';
import { createHeaders, classNames } from '@/util/utils';
import { useAccessToken } from '@/hooks/useAccessToken';
import styles from './styles.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

type Props = {
  url: string;
  type?: string;
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
      {type && (
        <h2 className="mb-6 w-full bg-neutral-1 p-3 text-center text-2xl font-bold capitalize text-primary-8">
          {type}
        </h2>
      )}
      {type === AnalysisType.Thumbnail ? (
        <ImageViewer contentUrl={url} />
      ) : (
        <Document
          options={options}
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className={classNames('w-full', styles.pdf)}
        >
          {Array.from(new Array(totalPages), (el, index) => (
            <Fragment key={url}>
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
            </Fragment>
          ))}
        </Document>
      )}
      <Divider />
    </div>
  );
}

function ImageViewer({ contentUrl }: { contentUrl: string }) {
  const [thumbnail, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        return null;
      }
      setLoading(true);
      fetch(contentUrl, {
        method: 'GET',
        headers: createHeaders(session.accessToken),
      })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          setImage(URL.createObjectURL(blob));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    })();
  }, [contentUrl]);

  if (thumbnail) {
    return (
      <div className="relative flex h-96 w-full max-w-2xl items-center justify-center">
        <Image
          fill
          objectFit="contains"
          alt="Stimulus plot"
          className="border border-neutral-2"
          src={thumbnail}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <Skeleton.Image
          active={loading}
          className="!h-full !w-full rounded-none"
          rootClassName="!h-full !w-full"
        />
      ) : (
        <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
