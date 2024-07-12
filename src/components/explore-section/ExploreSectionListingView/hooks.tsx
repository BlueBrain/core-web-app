import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { ConfigProvider, Button } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';

import ChevronLast from '@/components/icons/ChevronLast';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataType } from '@/constants/explore-section/list-views';
import usePathname from '@/hooks/pathname';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import type { ExploreESHit } from '@/types/explore-section/es';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { classNames } from '@/util/utils';

export type OnCellClick = (
  basePath: string,
  record: ExploreESHit<ExploreSectionResource>,
  type: DataType
) => void;

export function useOnCellRouteHandler({
  dataType,
  onCellClick,
}: {
  dataType: DataType;
  onCellClick?: OnCellClick;
}) {
  const pathname = usePathname();
  const setBackToListPath = useSetAtom(backToListPathAtom);

  const onCellRouteHandler = (
    col:
      | ColumnGroupType<ExploreESHit<ExploreSectionResource>>
      | ColumnType<ExploreESHit<ExploreSectionResource>>
  ) => {
    return {
      onCell: (record: ExploreESHit<ExploreSectionResource>) =>
        col.key !== Field.Preview
          ? {
              onClick: (e: MouseEvent<HTMLInputElement>) => {
                e.preventDefault();
                setBackToListPath(pathname);
                onCellClick?.(pathname, record, dataType);
              },
            }
          : {},
    };
  };

  return onCellRouteHandler;
}

export function useShowMore() {
  const [displayLoadMoreBtn, setDisplayLoadMoreBtn] = useState(false);
  const toggleDisplayMore = (value?: boolean) =>
    setDisplayLoadMoreBtn((state) => {
      return value ?? !state;
    });

  return { displayLoadMoreBtn, toggleDisplayMore };
}

function useTheme(children: ReactNode): ReactNode {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: '#003A8C',
            colorFillContent: '#003A8C',
            colorText: '#fff',
            zIndexPopupBase: 2,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

/**
 * Checks if the content inside the provided HTMLDivElement is horizontally scrollable to the right.
 * Returns true if there is content to the right that is not currently visible, false otherwise.
 * @param {HTMLDivElement} node - The HTMLDivElement to check for rightward scrollability.
 * @returns {boolean} - True if scrollable to the right, false otherwise.
 */
export const isRightScrollable = (node: HTMLElement): boolean =>
  (node?.scrollLeft ?? 0) + (node?.offsetWidth ?? 0) < (node?.scrollWidth ?? 0);

/**
 * Checks if the content inside the provided HTMLDivElement is horizontally scrollable to the left.
 * Returns the number of pixels scrolled to the left if scrollable, otherwise returns false.
 * @param {HTMLDivElement} node - The HTMLDivElement to check for leftward scrollability.
 * @returns {number | boolean} - Number of pixels scrolled to the left or false if not scrollable.
 */
export const isLeftScrollable = (node: HTMLElement): number | boolean =>
  node?.scrollLeft > 0 ? node.getBoundingClientRect().left : false;

export function useScrollNav(element?: HTMLDivElement): Record<'left' | 'right', ReactNode> {
  const [displayFloatButtons, setDisplayFloatButtons] = useState<{
    right: boolean;
    left: number | boolean;
  }>({
    right: false,
    left: false,
  });

  const updateDisplayControls = (node: HTMLElement) =>
    setDisplayFloatButtons({
      right: isRightScrollable(node),
      left: isLeftScrollable(node),
    });

  const handleScrollToRight = () =>
    element?.scrollTo({
      behavior: 'smooth',
      left: element.scrollWidth,
    });

  const handleScrollToLeft = () =>
    element?.scrollTo({
      behavior: 'smooth',
      left: 0,
    });

  useEffect(() => {
    const container = element as HTMLElement;
    const handleOnScroll = () => updateDisplayControls(container);
    const observer = new ResizeObserver((entries) => {
      updateDisplayControls(entries[0].target as HTMLDivElement);
    });

    if (container) {
      observer.observe(container);
      container.addEventListener('scroll', handleOnScroll);
    }
    return () => {
      if (container) {
        observer.unobserve(container);
        container.removeEventListener('scroll', handleOnScroll);
      }
    };
  }, [element]);

  const right = useTheme(
    <Button
      className={classNames(
        'flex items-center justify-center',
        !displayFloatButtons.right && 'collapse'
      )}
      onClick={handleScrollToRight}
      icon={<ChevronLast className="" />}
      disabled={!displayFloatButtons.right}
      shape="circle"
      size="large"
    />
  );

  const left = useTheme(
    <Button
      className={classNames(
        'flex items-center justify-center',
        !displayFloatButtons.left && 'collapse'
      )}
      onClick={handleScrollToLeft}
      icon={<ChevronLast className="rotate-180 transform" />}
      disabled={!displayFloatButtons.left}
      shape="circle"
      size="large"
    />
  );

  return {
    left,
    right,
  };
}
