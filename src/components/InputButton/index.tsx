import {
  ForwardedRef,
  HTMLProps,
  MouseEventHandler,
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { PlusIcon } from '@/components/icons';
import useForwardRef from '@/hooks/useForwardRef';

const Input = forwardRef(
  (
    { onBlur, onInput, type, value }: HTMLProps<HTMLInputElement>,
    forwardedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const ref = useForwardRef<HTMLInputElement>(forwardedRef);

    useEffect(() => ref?.current?.focus(), [ref]); // Auto-focus on render

    return (
      <div className="bg-primary-7 flex gap-5 items-center justify-between min-w-[340px] rounded-md text-white p-5">
        <input
          className="bg-transparent placeholder:text-neutral-3 w-full"
          onBlur={onBlur}
          onInput={onInput}
          placeholder="Search for conditions or dimensions"
          ref={ref}
          type={type}
          value={value}
        />
        <SearchOutlined />
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
      className="bg-primary-7 flex font-bold gap-10 items-center justify-between rounded-md text-white p-5"
      onClick={onClick}
      type="button"
    >
      <span>{children}</span>
      <PlusIcon />
    </button>
  );
}

export default function InputButton({
  focused,
  onBlur,
  onClick,
  onInput,
  type = 'text',
  value,
}: HTMLProps<HTMLInputElement> & {
  focused: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  const searchInput: RefObject<HTMLInputElement> = useRef(null);

  return focused ? (
    <Input onBlur={onBlur} onInput={onInput} ref={searchInput} type={type} value={value} />
  ) : (
    <Button onClick={onClick}>{value || 'Add conditions or dimensions'}</Button>
  );
}
