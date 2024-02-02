import {
  ChangeEvent,
  ForwardedRef,
  HTMLProps,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAtom } from 'jotai';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { searchStringAtom } from '@/state/explore-section/list-view-atoms';
import useForwardRef from '@/hooks/useForwardRef';
import { DataType } from '@/constants/explore-section/list-views';

const Input = forwardRef(
  (
    { onBlur, onInput, placeholder = 'Search', type, value }: HTMLProps<HTMLInputElement>,
    forwardedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const ref = useForwardRef<HTMLInputElement>(forwardedRef);

    useEffect(() => ref?.current?.focus(), [ref]); // Auto-focus on render

    return (
      <div className="mx-auto flex w-full max-w-2xl items-center border-b border-neutral-2 focus-within:border-b-primary-8">
        <input
          className="w-full bg-transparent py-2 text-primary-7 placeholder:text-neutral-3"
          style={{ outline: 'unset' }}
          onBlur={onBlur}
          onInput={onInput}
          ref={ref}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        <SearchOutlined className="py-2 text-primary-8" />
      </div>
    );
  }
);

Input.displayName = 'Input';

type SearchProps = {
  dataType: DataType;
};

export default function ExploreSectionNameSearch({ dataType }: SearchProps) {
  const [searchStringAtomValue, setSearchStringAtomValue] = useAtom(searchStringAtom({ dataType }));
  const [searchStringLocalState, setSearchStringLocalState] = useState(searchStringAtomValue);

  const searchInput: RefObject<HTMLInputElement> = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateAtom = useCallback(
    debounce((searchStr: string) => setSearchStringAtomValue(searchStr), 600),
    [setSearchStringAtomValue]
  );

  useEffect(() => {
    debouncedUpdateAtom(searchStringLocalState);
  }, [searchStringLocalState, debouncedUpdateAtom]);

  // "Clear filters" side-effect
  useEffect(() => {
    setSearchStringLocalState(searchStringAtomValue);
  }, [searchStringAtomValue, setSearchStringLocalState]);

  return (
    <Input
      onInput={(e: ChangeEvent<HTMLInputElement>) => setSearchStringLocalState(e.target.value)}
      ref={searchInput}
      placeholder="Search for resources..."
      type="text"
      value={searchStringLocalState}
    />
  );
}
