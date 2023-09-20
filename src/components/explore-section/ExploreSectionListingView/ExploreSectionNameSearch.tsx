import {
  ChangeEvent,
  ForwardedRef,
  HTMLProps,
  MouseEventHandler,
  ReactNode,
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

type SearchProps = {
  experimentTypeName: string;
  resourceId?: string;
};

export default function ExploreSectionNameSearch({ experimentTypeName, resourceId }: SearchProps) {
  const [searchStringAtomValue, setSearchStringAtomValue] = useAtom(
    searchStringAtom({ experimentTypeName, resourceId })
  );
  const [searchStringLocalState, setSearchStringLocalState] = useState(searchStringAtomValue);

  const [active, setActive] = useState<boolean>(false);

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

  return active ? (
    <Input
      onBlur={() => setActive(false)}
      onInput={(e: ChangeEvent<HTMLInputElement>) => setSearchStringLocalState(e.target.value)}
      ref={searchInput}
      placeholder="Search by text..."
      type="text"
      value={searchStringLocalState}
    />
  ) : (
    <Button onClick={() => setActive(true)}>
      <SearchOutlined />
    </Button>
  );
}
