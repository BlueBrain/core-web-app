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
  const [inputCompositionValue, setInputCompositionValue] = useState<number>(composition);

  useEffect(() => {
    setInputCompositionValue(composition);
  }, [composition]);

  return (
    <input
      disabled={isDisabled}
      className="bg-transparent text-primary-1 border-solid border border-primary-6 outline-none text-right pr-[3px]"
      type="number"
      max={max}
      min={0}
      value={inputCompositionValue}
      onChange={(value) => {
        const numericValue = Number.isNaN(value.target.valueAsNumber)
          ? 0
          : value.target.valueAsNumber;
        setInputCompositionValue(numericValue);
      }}
      onKeyUp={(action) => {
        if (action.key === 'Enter') {
          compositionChangeFunc(inputCompositionValue);
        }
      }}
      onBlur={() => compositionChangeFunc(inputCompositionValue)}
    />
  );
}
