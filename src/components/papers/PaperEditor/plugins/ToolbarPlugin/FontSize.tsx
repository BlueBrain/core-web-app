import { useCallback, useEffect, useState } from 'react';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection, LexicalEditor } from 'lexical';
import isNaN from 'lodash/isNaN';

import EditorButton from '../../molecules/Button';
import { TextIncrease, TextDecrease } from '@/components/icons/EditorIcons';

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 15;

enum UpdateFontSizeType {
  increment = 1,
  decrement,
}

export default function FontSize({
  selectionFontSize,
  disabled,
  editor,
}: {
  selectionFontSize: string;
  disabled: boolean;
  editor: LexicalEditor;
}) {
  const [inputValue, setInputValue] = useState<string>(selectionFontSize);
  const [inputChangeFlag, setInputChangeFlag] = useState<boolean>(false);

  /**
   * Calculates the new font size based on the update type.
   * @param currentFontSize - The current font size
   * @param updateType - The type of change, either increment or decrement
   * @returns the next font size
   */
  const calculateNextFontSize = (
    currentFontSize: number,
    updateType: UpdateFontSizeType | null
  ) => {
    if (!updateType) {
      return currentFontSize;
    }

    let updatedFontSize: number = currentFontSize;
    switch (updateType) {
      case UpdateFontSizeType.decrement:
        switch (true) {
          case currentFontSize > MAX_ALLOWED_FONT_SIZE:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize >= 48:
            updatedFontSize -= 12;
            break;
          case currentFontSize >= 24:
            updatedFontSize -= 4;
            break;
          case currentFontSize >= 14:
            updatedFontSize -= 2;
            break;
          case currentFontSize >= 9:
            updatedFontSize -= 1;
            break;
          default:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      case UpdateFontSizeType.increment:
        switch (true) {
          case currentFontSize < MIN_ALLOWED_FONT_SIZE:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize < 12:
            updatedFontSize += 1;
            break;
          case currentFontSize < 20:
            updatedFontSize += 2;
            break;
          case currentFontSize < 36:
            updatedFontSize += 4;
            break;
          case currentFontSize <= 60:
            updatedFontSize += 12;
            break;
          default:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      default:
        break;
    }
    return updatedFontSize;
  };

  const updateFontSizeInSelection = useCallback(
    (newFontSize: string | null, updateType: UpdateFontSizeType | null) => {
      const getNextFontSize = (prevFontSize: string | null): string => {
        if (!prevFontSize) {
          // eslint-disable-next-line no-param-reassign
          prevFontSize = `${DEFAULT_FONT_SIZE}px`;
        }
        // eslint-disable-next-line no-param-reassign
        prevFontSize = prevFontSize.slice(0, -2);
        const nextFontSize = calculateNextFontSize(Number(prevFontSize), updateType);
        return `${nextFontSize}px`;
      };

      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              'font-size': newFontSize || getNextFontSize,
            });
          }
        }
      });
    },
    [editor]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue);

    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      setInputValue('');
      return;
    }
    setInputChangeFlag(true);
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();

      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleInputBlur = () => {
    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleButtonClick = (updateType: UpdateFontSizeType) => {
    if (inputValue !== '') {
      const nextFontSize = calculateNextFontSize(Number(inputValue), updateType);
      updateFontSizeInSelection(`${String(nextFontSize)}px`, null);
    } else {
      updateFontSizeInSelection(null, updateType);
    }
  };

  const updateFontSizeByInputValue = (inputValueNumber: number) => {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    setInputValue(String(updatedFontSize));
    updateFontSizeInSelection(`${String(updatedFontSize)}px`, null);
    setInputChangeFlag(false);
  };

  useEffect(() => {
    setInputValue(selectionFontSize);
  }, [selectionFontSize]);

  return (
    <div className="flex items-center justify-center gap-1">
      <input
        type="number"
        value={inputValue}
        disabled={disabled}
        className="h-8 w-8 border px-1 py-1 text-center text-base font-bold text-gray-700 focus-visible:outline-0"
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        onBlur={handleInputBlur}
      />
      <EditorButton
        aria-label="minus"
        disabled={
          disabled || (selectionFontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)
        }
        icon={<TextDecrease />}
        onClick={() => handleButtonClick(UpdateFontSizeType.decrement)}
      />
      <EditorButton
        aria-label="plus"
        disabled={
          disabled || (selectionFontSize !== '' && Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)
        }
        icon={<TextIncrease />}
        onClick={() => handleButtonClick(UpdateFontSizeType.increment)}
      />
    </div>
  );
}
