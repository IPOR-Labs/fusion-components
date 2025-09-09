import { normalizeNumberInput } from '@/lib/normalize-number-input';
import { useEffect, useRef, useState } from 'react';
import { formatInputValueDisplay, removeSeparator } from '@/lib/format-input-value-display';
import { type InputHTMLAttributes, type DetailedHTMLProps } from 'react';
import { processInputValueChange } from '@/lib/process-input-value-change';
import { Input } from '@/components/ui/input';

export const INPUT_VALUE_SEPARATOR = ',';

type InputHtmlProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type Props = Omit<InputHtmlProps, 'onChange' | 'value'> & {
  maxDecimals?: number;
  value: string;
  onChange: (value: string) => void;
};

export const NumberInput = ({
  maxDecimals,
  onChange,
  value,
  ...inputProps
}: Props) => {
  const formattedValue = formatInputValueDisplay(value);
  const [cursor, setCursor] = useState(formattedValue.length);
  const [lastKeyStroke, setLastKeyStroke] = useState<string | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    setLastKeyStroke(key);
  };

  const handleOnSelect = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { selectionEnd } = target;
    setSelectionEnd(selectionEnd);
  };

  const processChange = ({
    valueAfterChange,
    selectionStart,
  }: {
    valueAfterChange: string;
    selectionStart: number | null;
  }) => {
    const { cursorPosition, modifiedValue } = processInputValueChange({
      selectionStart,
      selectionEnd,
      valueAfterChange,
      previousValue: formattedValue,
      groupSeparator: INPUT_VALUE_SEPARATOR,
      lastKeyStroke,
    });

    if (cursorPosition !== null) {
      setCursor(cursorPosition);
    }

    return removeSeparator(modifiedValue);
  };

  useEffect(() => {
    if (inputRef && typeof inputRef === 'object' && inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor);
    }
  }, [inputRef, value]);

  return (
    <Input
      {...inputProps}
      value={formattedValue}
      ref={inputRef}
      onKeyDown={handleOnKeyDown}
      onSelect={handleOnSelect}
      type="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      onChange={({ target }) => {
        const { value, selectionStart } = target;
        const modifiedValue = processChange({
          valueAfterChange: value,
          selectionStart,
        });
        const normalized = normalizeNumberInput(modifiedValue, {
          maxDecimals,
        });

        if (normalized === null) {
          return;
        }

        onChange(normalized);
      }}
    />
  );
};

