import { useEffect, useState } from 'react';
import { ConfigProvider, FloatButton } from 'antd';

import ChevronLast from '@/components/icons/ChevronLast';

const bottomFloatValue = 20;
const horizantalDefaultFloatValue = 12;

/**
 * Checks if the content inside the provided HTMLDivElement is horizontally scrollable to the right.
 * Returns true if there is content to the right that is not currently visible, false otherwise.
 * @param {HTMLDivElement} node - The HTMLDivElement to check for rightward scrollability.
 * @returns {boolean} - True if scrollable to the right, false otherwise.
 */
const isRightScrollable = (node: HTMLElement): boolean =>
  (node?.scrollLeft ?? 0) + (node?.offsetWidth ?? 0) < (node?.scrollWidth ?? 0);

/**
 * Checks if the content inside the provided HTMLDivElement is horizontally scrollable to the left.
 * Returns the number of pixels scrolled to the left if scrollable, otherwise returns false.
 * @param {HTMLDivElement} node - The HTMLDivElement to check for leftward scrollability.
 * @returns {number | boolean} - Number of pixels scrolled to the left or false if not scrollable.
 */
const isLeftScrollable = (node: HTMLElement): number | boolean =>
  node?.scrollLeft > 0 ? node.getBoundingClientRect().left : false;

/**
 * Component for displaying scroll navigation buttons (left and right) for a horizontally scrollable content.
 * This component utilizes the ResizeObserver API and scroll event to dynamically update the visibility
 * of scroll buttons based on changes in the container size and scroll position.
 * @param {RefObject<HTMLDivElement>} props.wrapperRef - Reference to the container element.
 * @returns {JSX.Element | null} - Scroll navigation buttons component.
 */

export default function ListingScrollNavControl<T extends HTMLElement>({
  show,
  element,
  extraRightSpace,
  extraLeftSpace,
}: {
  show?: boolean;
  element?: T;
  extraRightSpace?: number;
  extraLeftSpace?: number;
}) {
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

  if ((!displayFloatButtons.left && !displayFloatButtons.right) || !show) return null;
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: '#003A8C',
          colorFillContent: '#003A8C',
          colorText: '#fff',
          zIndexPopupBase: 2,
        },
      }}
    >
      {displayFloatButtons.right && (
        <FloatButton
          onClick={handleScrollToRight}
          icon={<ChevronLast className="h-5 w-5" />}
          className="!bottom-6 z-[2] !h-[2.93rem]"
          style={{
            right: extraRightSpace
              ? extraRightSpace + horizantalDefaultFloatValue
              : horizantalDefaultFloatValue,
            bottom: bottomFloatValue,
          }}
        />
      )}
      {displayFloatButtons.left && (
        <FloatButton
          onClick={handleScrollToLeft}
          icon={<ChevronLast className="h-5 w-5 rotate-180 transform" />}
          className="!bottom-6 z-[2] !h-[2.93rem]"
          style={{
            left: Number(displayFloatButtons.left) + (extraLeftSpace ?? 0),
            bottom: bottomFloatValue,
          }}
        />
      )}
    </ConfigProvider>
  );
}
