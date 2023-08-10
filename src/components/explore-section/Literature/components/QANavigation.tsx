'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { DeleteOutlined } from '@ant-design/icons';
import delay from 'lodash/delay';
import last from 'lodash/last';

import { GenerativeQA } from '../types';
import { classNames } from '@/util/utils';
import {
  literatureAtom,
  literatureResultAtom,
  useLiteratureAtom,
  useLiteratureResultsAtom,
} from '@/state/literature';

type QAHistoryNavigationItemProps = Pick<GenerativeQA, 'id' | 'question' | 'askedAt'> & {
  index: number;
};

function QAHistoryNavigationItem({ id, index, question }: QAHistoryNavigationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { activeQuestionId } = useAtomValue(literatureAtom);
  const { remove, QAs } = useLiteratureResultsAtom();
  const update = useLiteratureAtom();

  const isActive = activeQuestionId === id;

  const onClick = () => update('activeQuestionId', id);
  const onDelete = () => {
    setIsDeleting(true);
    delay(() => {
      remove(id);
      setIsDeleting(false);
      update('activeQuestionId', QAs ? last(QAs)?.id : null);
    }, 1000);
  };

  return (
    <a
      href={`#${id}`}
      role="button"
      onClick={onClick}
      className={classNames(
        'relative inline-flex items-center w-full pl-16 mb-2 list-none gqa-nav-item text-neutral-8',
        isDeleting ? 'animate-slide-out' : ''
      )}
    >
      {isActive && (
        <div
          className={classNames(
            'absolute inline-flex w-10 h-[3.5px] transition-all duration-200 ease-in-expo transform rounded-full top-[10.5px] left-3 bg-primary-8',
            isDeleting ? 'hidden' : ''
          )}
        />
      )}
      <div className="flex flex-col items-start justify-start w-full">
        <div className="inline-flex items-center justify-between w-full gap-2">
          <div className="text-sm font-medium capitalize text-neutral-3">question {index}</div>
          <DeleteOutlined
            className="text-sm transition-all transform scale-110 text-neutral-3 hover:text-primary-8"
            onClick={onDelete}
          />
        </div>
        <div
          title={question}
          className={classNames(
            'w-4/5 text-xl line-clamp-2 ',
            isActive ? 'text-primary-8 font-bold' : 'text-neutral-3 font-medium'
          )}
        >
          {question}
        </div>
      </div>
    </a>
  );
}

function QAHistoryNavigation() {
  const QAs = useAtomValue(literatureResultAtom);
  const update = useLiteratureAtom();
  const showNavigation = QAs.length > 1;
  const firstRenderRef = useRef(false);
  const qaNavigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // set the active question to the last question just in the first reneder
    if (QAs.length > 0 && !firstRenderRef.current) {
      update('activeQuestionId', QAs[QAs.length - 1].id);
      firstRenderRef.current = true;
    }
  }, [QAs, update, firstRenderRef]);

  useEffect(() => {
    if (qaNavigationRef.current) {
      qaNavigationRef.current.scrollTo({
        behavior: 'smooth',
        top: qaNavigationRef.current.scrollHeight,
      });
    }
  }, [QAs.length]);

  if (!showNavigation) return null;

  return (
    <nav
      ref={qaNavigationRef}
      id="gqa-navigation"
      className="flex flex-col h-full py-10 overflow-x-hidden no-scrollbar scroll-smooth"
    >
      {QAs.map((qa, index) => (
        <QAHistoryNavigationItem
          key={`history-nav-item-${qa.id}`}
          {...{
            index: index + 1,
            id: qa.id,
            askedAt: qa.askedAt,
            question: qa.question,
            articles: qa.articles,
          }}
        />
      ))}
    </nav>
  );
}

export default QAHistoryNavigation;
