import {
  ForwardedRef,
  HTMLProps,
  MouseEventHandler,
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSetAtom } from 'jotai';
import debounce from 'lodash/debounce';
import { SearchOutlined } from '@ant-design/icons';
import { searchStringAtom } from '@/state/explore-section/list-view-atoms';
import useForwardRef from '@/hooks/useForwardRef';

const Input = forwardRef(
  (
    { onBlur, onInput, placeholder = 'Search', type, value }: HTMLProps<HTMLInputElement>,
    forwardedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const ref = useForwardRef<HTMLInputElement>(forwardedRef);

    useEffect(() => ref?.current?.focus(), [ref]); // Auto-focus on render

    return (
      <div className="border border-primary-3 flex items-center">
        <input
          className="bg-transparent placeholder:text-neutral-3 text-primary-7 hover:text-primary-5 h-[56] p-3"
          onBlur={onBlur}
          onInput={onInput}
          ref={ref}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        <SearchOutlined className="p-3" />
      </div>
    );
  }
);

Input.displayName = 'Input';

function Button({
  onClick,
  children,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="bg-transparent border border-primary-3 flex items-center p-3 text-primary-7"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function ExploreSectionNameSearch() {
  const setSearchString = useSetAtom(searchStringAtom);

  const searchInput: RefObject<HTMLInputElement> = useRef(null);
  const [openSearchInput, setOpenSearchInputOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  useEffect(() => debounce(() => setSearchString(value), 250), [setSearchString, value]);

  return openSearchInput ? (
    <Input
      onBlur={() => setOpenSearchInputOpen(false)}
      onInput={(e) => setValue((e.target as HTMLInputElement).value)}
      ref={searchInput}
      placeholder="Type your search..."
      type="text"
      value={value}
    />
  ) : (
    <Button onClick={() => setOpenSearchInputOpen(true)}>
      <SearchOutlined />
    </Button>
  );
}
