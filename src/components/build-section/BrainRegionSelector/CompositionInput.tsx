import React, { useEffect, useState } from 'react';

type CompositionInputProps = {
  isDisabled: boolean;
  max: number;
  composition: number;
  compositionChangeFunc: (value: number) => void;
};

export default function CompositionInput({
  composition,
  max,
  isDisabled,
  compositionChangeFunc,
}: CompositionInputProps) {
  const [value, setValue] = useState<number>(composition);

  useEffect(() => {
    setValue(composition);
  }, [composition]);

  return (
    <input
      disabled={isDisabled}
      className="bg-transparent text-primary-1 border-solid border border-primary-6 outline-none text-right pr-[3px]"
      type="number"
      max={max}
      min={0}
      value={value}
      onChange={(event) => {
        const numericValue = Number.isNaN(event.target.valueAsNumber)
          ? 0
          : event.target.valueAsNumber;
        setValue(numericValue);
      }}
      onKeyUp={(action) => {
        if (action.key === 'Enter') {
          compositionChangeFunc(value);
        }
      }}
      onBlur={() => compositionChangeFunc(value)}
    />
  );
}
