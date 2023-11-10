'use client';

import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useAtomValue } from 'jotai';
import {
  AppstoreOutlined,
  DeleteOutlined,
  EnterOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import delay from 'lodash/delay';
import last from 'lodash/last';
import startCase from 'lodash/startCase';

import useContextualLiteratureContext from '../useContextualLiteratureContext';
import { BrainIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import { literatureAtom, useLiteratureAtom, useLiteratureResultsAtom } from '@/state/literature';
import { GenerativeQA, SucceededGenerativeQA } from '@/types/literature';

type QAHistoryNavigationItemProps = Pick<
  GenerativeQA,
  'id' | 'question' | 'askedAt' | 'brainRegion' | 'isNotFound'
> &
  Pick<SucceededGenerativeQA, 'extra'> & {
    index: number;
  };

function IndicationIcon({
  title,
  icon,
  isActive,
}: {
  title: string;
  icon: JSX.Element;
  isActive?: boolean;
}) {
  return (
    <div
      className={classNames(
        'inline-flex items-center gap-2 my-1',
        isActive ? 'text-primary-5' : 'text-gray-400'
      )}
    >
      {icon}
      <span
        title={title}
        className={classNames(
          'text-base line-clamp-1',
          isActive ? 'text-primary-5' : 'text-gray-400'
        )}
      >
        {title}
      </span>
    </div>
  );
}

function QAHistoryNavigationItem({
  id,
  index,
  question,
  brainRegion,
  isNotFound,
  extra,
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

  const showParameters = brainRegion?.id || (extra && (extra.buildStep || extra.DensityOrCount));
  return (
    <a
      href={`#${id}`}
      role="button"
      onClick={onClick}
      className={classNames(
        'relative inline-flex items-center w-full pl-16 py-4 pr-2 list-none gqa-nav-item text-neutral-8 hover:bg-gray-50 rounded-r-sm group cursor-pointer',
        isDeleting && 'bg-gray-100 overflow-hidden py-4 animate-scale-down'
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
          <div className="text-sm font-medium capitalize text-neutral-3 group-hover:text-neutral-4 group-hover:font-bold">
            question {index}
          </div>
          <DeleteOutlined
            className="text-sm hover:transition-all hover:transform hover:scale-110 text-neutral-3 hover:text-primary-8 group-hover:text-primary-8"
            onClick={onDelete}
          />
        </div>
        {showParameters && (
          <div className="flex flex-col items-start w-3/4 py-2 my-2 border-t border-b border-gray-200">
            {brainRegion?.id && (
              <IndicationIcon icon={<BrainIcon />} title={brainRegion.title} isActive={isActive} />
            )}
            {extra && extra.buildStep && (
              <IndicationIcon
                icon={<AppstoreOutlined />}
                title={startCase(extra.buildStep)}
                isActive={isActive}
              />
            )}
            {extra && extra.DensityOrCount && (
              <IndicationIcon
                icon={<EnterOutlined className="scale-y-100 -scale-x-100" />}
                title={startCase(extra.DensityOrCount)}
                isActive={isActive}
              />
            )}
          </div>
        )}
        <div title={question} className="w-full">
          <div
            data-testid="question-navigation-item"
            className={classNames(
              'w-4/5 text-xl line-clamp-2 group-hover:text-primary-8',
              isNotFound && isActive && 'text-amber-500',
              isActive ? 'text-primary-8 font-extrabold' : 'text-neutral-3 font-medium'
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
  const update = useLiteratureAtom();
  const firstRenderRef = useRef(false);
  const qaNavigationRef = useRef<HTMLElement>(null);
  const { dataSource, isBuildSection, isContextualLiterature } = useContextualLiteratureContext();

  const showNavigation = isContextualLiterature ? true : dataSource.length > 1;

  useEffect(() => {
    // set the active question to the last question just in the first reneder
    if (dataSource.length > 0 && !firstRenderRef.current) {
      update('activeQuestionId', dataSource[dataSource.length - 1].id);
      firstRenderRef.current = true;
    }
  }, [dataSource, update, firstRenderRef]);

  useEffect(() => {
    if (qaNavigationRef.current) {
      qaNavigationRef.current.scrollTo({
        behavior: 'smooth',
        top: qaNavigationRef.current.scrollHeight,
      });
    }
  }, [dataSource.length]);

  if (!showNavigation) return null;

  return (
    <nav
      ref={qaNavigationRef}
      id="gqa-navigation"
      className={classNames(
        'flex flex-col py-10 overflow-x-hidden no-scrollbar scroll-smooth',
        isBuildSection ? '-ml-10 h-[calc(100%-240px)]' : 'h-full'
      )}
    >
      {dataSource.map((qa, index) => (
        <QAHistoryNavigationItem
          key={`history-nav-item-${qa.id}`}
          {...{
            index: index + 1,
            id: qa.id,
            askedAt: qa.askedAt,
            question: qa.question,
            brainRegion: qa.brainRegion,
            isNotFound: qa.isNotFound,
            extra: (qa as SucceededGenerativeQA).extra,
          }}
        />
      ))}
    </nav>
  );
}

export default QAHistoryNavigation;
