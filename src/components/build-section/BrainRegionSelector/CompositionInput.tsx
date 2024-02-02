import React, { useEffect, useState } from 'react';

type CompositionInputProps = {
  composition: number;
  compositionChangeFunc: (value: number) => void;
};

export default function CompositionInput({
  composition,
  compositionChangeFunc,
}: CompositionInputProps) {
  const [value, setValue] = useState<number>(composition);

  useEffect(() => {
    setValue(composition);
  }, [composition]);

  return (
    <input
      className="border border-solid border-primary-6 bg-transparent pr-[3px] text-right text-primary-1 outline-none"
      type="number"
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
