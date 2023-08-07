'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import {
  ArrowRightOutlined,
  HomeOutlined,
  MinusOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import SectionCards from '@/components/explore-section/SectionCards';
import { sectionContent } from '@/constants/homes-sections/homeSectionContent';
import type { TypeSingleCard } from '@/constants/homes-sections/homeSectionContent';
import { classNames } from '@/util/utils';

function LiteratureSidebar() {
  const [expanded, setExpanded] = useState(false);
  const onExpand = () => setExpanded((prev) => !prev);

  return (
    <div
      className={classNames(
        'fixed top-0 z-50 py-4 inline-flex flex-col items-center justify-start h-screen transition-transform ease-in-out will-change-auto bg-primary-9 text-light',
        expanded ? 'w-80' : 'w-10'
      )}
    >
      <div
        className={`inline-flex w-full ${
          expanded
            ? 'flex-row-reverse items-center justify-between px-4 mb-4'
            : ' flex-col items-center justify-center gap-6 mb-auto'
        }`}
      >
        <Button
          type="text"
          className="relative order-1"
          onClick={onExpand}
          style={{ color: 'white' }}
          icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
        />
        <span
          className={classNames(
            'relative order-2 p-0 text-white',
            expanded ? 'font-bold text-2xl' : '-rotate-90 font-semibold'
          )}
        >
          Literature
        </span>
      </div>
      {expanded && (
        <div className="flex flex-col w-full h-full px-4 overflow-y-auto primary-scrollbar gap-y-3">
          {sectionContent.map((singleCard: TypeSingleCard, index: number) => (
            <SectionCards
              content={singleCard}
              cardIndex={index}
              expanded={expanded}
              key={`explore-section-card-${singleCard.name}`}
            />
          ))}
        </div>
      )}
      <div className="relative bottom-0 w-full mt-auto h-max">
        <ul
          className={classNames(
            'w-full',
            expanded
              ? 'px-4 py-4'
              : 'flex flex-col items-center justify-center gap-2 absolute bottom-4'
          )}
        >
          <li
            className={`${
              expanded
                ? 'border-b border-primary-7 w-full flex items-center justify-between py-2'
                : ''
            }`}
          >
            <Link
              href="/"
              className={`${
                expanded ? 'font-semibold w-full flex items-center justify-between' : ''
              }`}
            >
              {expanded && 'Home'}
              <HomeOutlined />
            </Link>
          </li>
          <li className={`${expanded ? 'w-full flex items-center justify-between py-2' : ''} `}>
            <Link
              href="/"
              className={`${
                expanded ? 'font-semibold w-full flex items-center justify-between' : ''
              }`}
            >
              {expanded && 'User'}
              <UserOutlined />
            </Link>
          </li>
        </ul>
        {expanded && (
          <ul className="flex flex-col w-full p-4 gap-y-2 h-max">
            <li className="p-2 text-white bg-primary-6">
              <Link href="/build" className="flex items-center justify-between gap-2 ">
                <h2>Build</h2>
                <ArrowRightOutlined />
              </Link>
            </li>
            <li className="p-2 text-white bg-primary-6">
              <Link href="/simulate" className="flex items-center justify-between gap-2">
                <h2>Simulate</h2>
                <ArrowRightOutlined />
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default LiteratureSidebar;
