import { createPortal } from 'react-dom';
import { ReactNode, useReducer, useRef, useState } from 'react';
import { DownloadOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

import EditorButton from '../../molecules/Button';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import { classNames } from '@/util/utils';

const blockInsert = [
  {
    key: 'image',
    label: 'Image',
  },
  {
    key: 'gallery',
    label: 'Gallery',
  },
  {
    key: 'video',
    label: 'Video',
  },
  {
    key: 'analysis',
    label: 'Analysis',
  },
  {
    key: 'graph',
    label: 'Graph',
  },
  {
    key: 'code',
    label: 'Code',
  },
  {
    key: 'footnote',
    label: 'Footnote',
  },
];

const generateInsert = [
  {
    key: 'abstract',
    label: 'Abstract',
  },
  {
    key: 'summary',
    label: 'Summary',
  },
  {
    key: 'methods',
    label: 'Methods',
  },
  {
    key: 'references',
    label: 'References',
  },
];

function InsertButton({
  icon,
  label,
  className,
}: {
  icon: ReactNode;
  label: string;
  className: string;
}) {
  return (
    <button
      type="button"
      className={classNames(
        'flex h-11 w-40 min-w-max items-center justify-between gap-2 rounded-none px-3 py-2 text-primary-8',
        'border border-gray-200 hover:bg-gray-200',
        className
      )}
    >
      <span className="text-primary-8">{label}</span>
      {icon}
    </button>
  );
}

export default function InsertPlugin() {
  const ref = useRef(null);
  const [showMenu, toggleShowMenu] = useReducer((val) => !val, false);
  const [floatingInsertElem, setFloatingInsertElem] = useState<HTMLDivElement | null>(null);

  useOnClickOutside(ref, toggleShowMenu);
  const onRef = (_floatingInsertElem: HTMLDivElement) => {
    if (_floatingInsertElem !== null) {
      setFloatingInsertElem(_floatingInsertElem);
    }
  };

  return (
    <div className="fixed bottom-24 right-16 z-20 flex items-center justify-end">
      <div className="relative">
        <div ref={onRef} className="relative" />
        {!showMenu && (
          <EditorButton
            title="Insert"
            aria-label="Insert Custom Elements"
            className="!h-10 !w-10 !border border-primary-7 !bg-white text-primary-8"
            onClick={toggleShowMenu}
            icon={<PlusOutlined />}
          />
        )}
        {showMenu &&
          floatingInsertElem &&
          createPortal(
            <div className="relative" ref={ref}>
              <button
                type="button"
                aria-label="Close insert menu"
                title="Close insert menu"
                onClick={toggleShowMenu}
                className="absolute -top-11 right-0 flex h-11 w-11 items-center justify-center border border-b-0 border-gray-200 bg-white p-3"
              >
                <MinusOutlined className="text-primary-8" />
              </button>
              <div className="flex items-start justify-start bg-white">
                <div className="flex w-1/3 flex-col">
                  <div className="w-40 min-w-max select-none border border-b-0 border-gray-200 px-3 py-2 text-gray-500">
                    Generate
                  </div>
                  <div className="grid w-full grid-rows-4">
                    {generateInsert.map(({ key, label }) => (
                      <InsertButton
                        key={key}
                        icon={<DownloadOutlined />}
                        label={label}
                        className="border-b-0 last:border-b"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex w-2/3 flex-col">
                  <div className="select-none border border-l-0 border-gray-200 px-3 py-2 text-gray-500">
                    Blocks
                  </div>
                  <div className="grid w-full grid-flow-col grid-rows-4">
                    {blockInsert.map(({ key, label }) => (
                      <InsertButton
                        key={key}
                        icon={<PlusOutlined />}
                        label={label}
                        className="border-l-0 border-t-0"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            floatingInsertElem as HTMLElement
          )}
      </div>
    </div>
  );
}
