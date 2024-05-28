import { useEffect } from 'react';

/**
 * A custom React hook that uses the scroll event to detect when an element has reached the end of its scrollable area.
 * It invokes a callback function with a boolean value indicating whether the element has scrolled to the bottom or not.
 * @param {HTMLElement | null | undefined} element - The element to listen for scroll events.
 * @param {(value: boolean) => void} callback - The function to call when the element scrolls to the bottom or not.
 * @returns {null} - not return anything.
 * @example
 * function Component() {
 *   const ref = useRef(null);
 *   const handleScrollComplete = (value) => {
 *     console.log(value ? "Scrolled to the bottom" : "Keep scrolling");
 *   };
 *   useScrollComplete(ref.current, handleScrollComplete);
 *   return <div ref={ref} style={{height: 1600, overflowY: "scroll"}}>long content</div>;
 * }
 */

export default function useScrollComplete({
  element,
  callback,
}: {
  element: HTMLElement | null | undefined;
  callback: (value: boolean) => void;
}) {
  useEffect(() => {
    const onScroll = ({ currentTarget }: Event) => {
      const { scrollHeight, clientHeight, scrollTop } = currentTarget as HTMLDivElement;
      callback(Math.abs(scrollHeight - clientHeight - scrollTop) < 1);
    };
    if (element) {
      element.addEventListener('scroll', onScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', onScroll);
      }
    };
  }, [callback, element]);

  return null;
}
