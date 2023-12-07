'use client';

import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { useEffect, useMemo, useState } from 'react';

import { ConfigProvider } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from '../Link';
import VirtualLabLabel from './VirtualLabLabel';
import { currentVirtualLabIdAtom, virtualLabsForUserAtom } from '@/state/virtual-lab/lab';
import { classNames } from '@/util/utils';

export default function VirtualLabsList() {
  const virtualLabs = useAtomValue(useMemo(() => unwrap(virtualLabsForUserAtom()), []));

  const [currentVirtualLabId, setCurrentVirtualLabId] = useAtom(currentVirtualLabIdAtom);

  const [virtualLabListExpanded, setVirtualLabListExpanded] = useState(false);
  const router = useRouter();

  const currentVirtualLab = virtualLabs?.find((lab) => lab.id === currentVirtualLabId);

  useEffect(() => {
    if (virtualLabs?.length && !currentVirtualLab) {
      setCurrentVirtualLabId(virtualLabs[0].id);
    }
  }, [virtualLabs, setCurrentVirtualLabId, currentVirtualLab]);

  if (!virtualLabs?.length || !currentVirtualLabId) {
    return null;
  }

  if (virtualLabs.length === 0 || !currentVirtualLab) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            colorBorder: 'none',
            colorText: 'white',
            colorHighlight: 'white',
            colorBgContainer: 'none',
            padding: 0,
            paddingContentHorizontal: 0,
            paddingContentVertical: 0,
          },
        },
        token: {
          colorText: 'white',
        },
      }}
    >
      <div className="inline-flex items-center justify-between w-full" data-testid="all-user-labs">
        {virtualLabs.length === 1 ? (
          <div className="p-5" data-testid="current-virtual-lab">
            <VirtualLabLabel labName={currentVirtualLab.name} />
            <Link
              href={`/virtual-lab/lab/${currentVirtualLab.id}`}
              className="text-primary-3 block font-normal mt-2"
            >
              Virtual Lab settings
            </Link>
          </div>
        ) : (
          <div className="w-full">
            {virtualLabListExpanded ? (
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setVirtualLabListExpanded(false)}
                  className="border-none text-xs"
                  type="button"
                  aria-label="Collapse Virtual Lab List"
                >
                  <UpOutlined className="text-white text-xs!" />
                </button>
              </div>
            ) : (
              <div
                className="p-4 cursor-pointer"
                role="presentation"
                aria-label="expand virtual lab list"
                data-testid="current-virtual-lab"
                onClick={() => setVirtualLabListExpanded(true)}
              >
                <div className="flex items-baseline justify-between">
                  <VirtualLabLabel labName={currentVirtualLab.name} />
                  <DownOutlined className="text-white text-xs" data-testid="expand-list-icon" />
                </div>

                <button
                  className="text-primary-3 block font-normal mt-2 w-max"
                  onClick={(e) => {
                    // Do not bubble this event to the parent that expands/collapses virtual lab list
                    e.preventDefault();
                    e.stopPropagation();

                    router.push(`/virtual-lab/lab/${currentVirtualLab.id}`);
                  }}
                  type="button"
                >
                  Virtual Lab settings
                </button>
              </div>
            )}
            <div className="overflow-hidden">
              <div
                className={classNames(
                  'transition-all duration-500',
                  virtualLabListExpanded ? 'mt-0' : 'mt-[-1000%]'
                )}
                data-collapse-animate="on"
              >
                <ul className="p-4">
                  {virtualLabs.map((lab) => (
                    <button
                      key={lab.id}
                      onClick={() => {
                        setVirtualLabListExpanded(false);
                        setCurrentVirtualLabId(lab.id);
                      }}
                      className="w-full flex items-center justify-between mt-3"
                      type="button"
                    >
                      <VirtualLabLabel labName={lab.name} />
                      <div
                        className={classNames(
                          'w-[14px] h-[14px] rounded-full bg-clip-content p-[2px] border border-white',
                          currentVirtualLabId === lab.id ? 'bg-white' : 'bg-none'
                        )}
                      />
                    </button>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}