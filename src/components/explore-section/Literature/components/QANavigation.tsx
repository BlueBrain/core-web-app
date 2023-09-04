'use client';

import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useAtomValue } from 'jotai';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import delay from 'lodash/delay';
import last from 'lodash/last';

import { BrainIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import {
  brainRegionQAs,
  literatureAtom,
  literatureResultAtom,
  useLiteratureAtom,
  useLiteratureResultsAtom,
} from '@/state/literature';
import { GenerativeQA } from '@/types/literature';
import usePathname from '@/hooks/pathname';

type QAHistoryNavigationItemProps = Pick<
  GenerativeQA,
  'id' | 'question' | 'askedAt' | 'brainRegion' | 'isNotFound'
> & {
  index: number;
};

function QAHistoryNavigationItem({
  id,
  index,
  question,
  brainRegion,
  isNotFound,
}: QAHistoryNavigationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { activeQuestionId } = useAtomValue(literatureAtom);
  const { remove } = useLiteratureResultsAtom();
  const update = useLiteratureAtom();

  const isActive = activeQuestionId === id;

  const onClick = () => update('activeQuestionId', id);
  const onDelete = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    delay(() => {
      const newQAs = remove(id);
      setIsDeleting(false);
      update('activeQuestionId', newQAs ? last(newQAs)?.id : null);
    }, 1000);
  };

  return (
    <a
      href={`#${id}`}
      role="button"
      onClick={onClick}
      className={classNames(
        'relative inline-flex items-center w-full pl-16 py-4 pr-2 list-none gqa-nav-item text-neutral-8 hover:bg-gray-50 rounded-r-sm group',
        isDeleting && 'bg-gray-100 overflow-hidden py-4 animate-slide-out'
      )}
    >
      {isActive && (
        <div
          className={classNames(
            'absolute inline-flex w-10 h-[3.5px] transition-all duration-200 ease-in-expo transform rounded-full top-6 left-3 bg-primary-8',
            isDeleting && 'hidden'
          )}
        />
      )}
      <div className="flex flex-col items-start justify-start w-full">
        <div className="inline-flex items-center justify-between w-full gap-2">
          <div className="text-sm font-medium capitalize text-neutral-3 group-hover:text-neutral-4">
            question {index}
          </div>
          <DeleteOutlined
            className="text-sm hover:transition-all hover:transform hover:scale-110 text-neutral-3 hover:text-primary-8 group-hover:text-primary-8"
            onClick={onDelete}
          />
        </div>
        {brainRegion?.id && (
          <div className="inline-flex items-center gap-2 my-1">
            <BrainIcon className="text-primary-5" />
            <span title={brainRegion.title} className="text-base text-primary-5 line-clamp-1">
              {brainRegion.title}
            </span>
          </div>
        )}
        <div title={question} className="w-full">
          <div
            data-testid="question-navigation-item"
            className={classNames(
              'w-4/5 text-xl line-clamp-2 group-hover:text-primary-8',
              isNotFound && isActive && 'text-amber-500',
              isActive ? 'text-primary-8 font-bold' : 'text-neutral-3 font-medium'
            )}
          >
            {question}
          </div>
          {isNotFound && (
            <div className="inline-flex items-center justify-start">
              <WarningOutlined className="mr-2 text-orange-300" />
              <span className="font-light text-amber-500">No Answer available</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function QAHistoryNavigation() {
  const pathname = usePathname();
  const allQAs = useAtomValue(literatureResultAtom);
  const brainReqionSpecificQAs = useAtomValue(brainRegionQAs);
  const update = useLiteratureAtom();
  const showNavigation = allQAs.length > 1;
  const firstRenderRef = useRef(false);
  const qaNavigationRef = useRef<HTMLElement>(null);
  const isBuildSection = pathname?.startsWith('/build');

  useEffect(() => {
    // set the active question to the last question just in the first reneder
    if (allQAs.length > 0 && !firstRenderRef.current) {
      update('activeQuestionId', allQAs[allQAs.length - 1].id);
      firstRenderRef.current = true;
    }
  }, [allQAs, update, firstRenderRef]);

  useEffect(() => {
    if (qaNavigationRef.current) {
      qaNavigationRef.current.scrollTo({
        behavior: 'smooth',
        top: qaNavigationRef.current.scrollHeight,
      });
    }
  }, [allQAs.length]);

  if (!showNavigation) return null;

  return (
    <nav
      ref={qaNavigationRef}
      id="gqa-navigation"
      className={classNames(
        'flex flex-col py-10 overflow-x-hidden no-scrollbar scroll-smooth',
        isBuildSection ? '-ml-10 h-[calc(100%-160px)]' : 'h-full'
      )}
    >
      {(isBuildSection ? brainReqionSpecificQAs : allQAs).map((qa, index) => (
        <QAHistoryNavigationItem
          key={`history-nav-item-${qa.id}`}
          {...{
            index: index + 1,
            id: qa.id,
            askedAt: qa.askedAt,
            question: qa.question,
            articles: qa.articles,
            brainRegion: qa.brainRegion,
            isNotFound: qa.isNotFound,
          }}
        />
      ))}
    </nav>
  );
}

export default QAHistoryNavigation;
