import { ComponentProps } from 'react';
import { classNames } from '@/util/utils';

export default function StripeInput({
  title,
  id,
  name,
  value,
  error,
  ...props
}: ComponentProps<'input'> & { title: string; error: boolean }) {
  return (
    <div className="mb-3">
      <label
        htmlFor={name}
        className="mb-1 w-full text-[16px] text-[#30313d]"
        style={{
          transition:
            'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      >
        {title}
        <input
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          id={id}
          name={name}
          value={value}
          className={classNames(
            'h-[44px] w-full rounded-[5px] border  border-solid bg-white p-3',
            error
              ? 'border-rose-600 shadow-[0px_1px_1px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.02),0_0_0_1px_#df1b41]'
              : 'border-neutral-200 shadow-[0px_1px_1px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.02)]'
          )}
          style={{
            transition:
              'background 0.15s ease, border 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
          }}
        />
        {error && (
          <p className="mt-1 text-[16px] text-rose-600" role="alert">
            Your {id} is invalid.
          </p>
        )}
      </label>
    </div>
  );
}
