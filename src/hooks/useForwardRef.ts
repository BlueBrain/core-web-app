import { ForwardedRef, useEffect, useRef } from 'react';

/** https://stackoverflow.com/questions/62238716/using-ref-current-in-react-forwardref */
const useForwardRef = <T>(ref: ForwardedRef<T>, initialValue: any = null) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current; // eslint-disable-line no-param-reassign
    }
  }, [ref]);

  return targetRef;
};

export default useForwardRef;
