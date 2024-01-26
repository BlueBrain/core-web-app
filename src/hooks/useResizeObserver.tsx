import { useEffect } from 'react';

/**
 * A custom React hook that uses the ResizeObserver API to detect size changes of an element.
 * It invokes a callback function with the element as an argument whenever a resize occurs.
 * @param {HTMLElement | null | undefined} element - The element to observe for size changes.
 * @param {(target: HTMLElement) => void} callback - The function to call when the element resizes.
 * @returns {null} - not return anything.
 * @example
 * function MyComponent() {
 *   const ref = useRef(null);
 *   const handleResize = (target) => {
 *     console.log(target.offsetWidth, target.offsetHeight);
 *   };
 *   useResizeObserver(ref.current, handleResize);
 *   return <div ref={ref}>Brain region view</div>;
 * }
 */

export default function useResizeObserver({
  element,
  callback,
}: {
  element: HTMLElement | null | undefined;
  callback: (target: HTMLElement) => void;
}) {
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      callback(entries[0].target as HTMLDivElement);
    });

    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [callback, element]);

  return null;
}
