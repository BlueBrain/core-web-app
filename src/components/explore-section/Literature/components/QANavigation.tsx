'use client';

import { useAtomValue } from 'jotai';
import { Switch } from 'antd';
import { literatureAtom, literatureResultAtom, useLiteratureAtom } from '../state';
import { TGenerativeQA } from '../types';
import { BrainIcon } from '@/components/icons';
import { classNames } from '@/util/utils';

type TGenerativeQAHistoryNavigationItemProps = Pick<
  TGenerativeQA,
  'id' | 'question' | 'askedAt' | 'brainRegion'
> & { index: number; };


function QAHistoryNavigationItem({
  index,
  id,
  question,
  brainRegion,
}: TGenerativeQAHistoryNavigationItemProps) {
  const { activeQuestionId } = useAtomValue(literatureAtom);
  const isActive = activeQuestionId === id;
  const update = useLiteratureAtom();
  const onClick = () => update('activeQuestionId', id);

  return (
    <li className='relative inline-flex items-center pl-16 mb-2 list-none gqa-nav-item text-neutral-8'>
      {isActive && <div className='absolute inline-flex w-10 h-[3.5px] transition-all duration-200 ease-in-expo transform rounded-full top-[10.5px] left-3 bg-primary-8' />}
      <div className='flex flex-col items-start justify-start'>
        <a
          href={`#${id}`}
          onClick={onClick}
          className={classNames(
            'uppercase text-primary-8',
            isActive ? 'font-bold' : 'font-medium',
          )}
        >
          question {index}
        </a>
        {brainRegion &&
          <div className='inline-flex items-center justify-start gap-y-1'>
            <BrainIcon />
            {brainRegion.title}
          </div>
        }
        <div className="text-xs font-light text-neutral-6">{question}</div>
      </div>
    </li>
  );
}
function QAHistoryNavigation() {
  const QAs = useAtomValue(literatureResultAtom);
  const showNavigation = QAs.length > 1;

  if (!showNavigation) return null;
  return (
    <nav
      id="gqa-navigation"
      className='h-full flex flex-col overflow-auto !primary-scrollbar py-10'
    >
      <div className='pl-16 my-2 mb-10'>
        <Switch size="small" className='mr-2' />
        <span className='font-semibold text-primary-8'>Show all questions</span>
      </div>
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
