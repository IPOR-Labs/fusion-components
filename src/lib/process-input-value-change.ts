import {
  formatInputValueDisplay,
  removeSeparator,
} from '@/lib/format-input-value-display';

export interface ProcessInputValueChangeParams {
  selectionStart: number | null;
  selectionEnd: number | null;
  valueAfterChange: string;
  lastKeyStroke: string | null;
  previousValue: string;
  groupSeparator?: string;
}

export interface ProcessInputValueChangeResult {
  modifiedValue: string;
  cursorPosition: number | null;
}

/**
 * Based on the last key stroke and the cursor position, update the value
 * and reposition the cursor to the right place
 */
export const processInputValueChange = ({
  selectionStart,
  selectionEnd,
  previousValue,
  valueAfterChange,
  lastKeyStroke,
  groupSeparator,
}: ProcessInputValueChangeParams): ProcessInputValueChangeResult => {
  let cursorPosition = selectionStart;
  let modifiedValue = valueAfterChange;
  if (previousValue && cursorPosition) {
    const isSelectingMultipleCharacters =
      selectionStart && selectionEnd && selectionEnd - 1 > selectionStart;
    const splitValue = valueAfterChange.split('');
    /**
     * if cursor is to the right of groupSeparator and backspace pressed,
     * delete the character to the left of the separator and reposition the cursor
     */
    if (
      lastKeyStroke === 'Backspace' &&
      previousValue[cursorPosition] === groupSeparator &&
      !isSelectingMultipleCharacters
    ) {
      splitValue.splice(cursorPosition - 1, 1);
      cursorPosition -= 1;
    }
    /**
     * if cursor is to the left of groupSeparator and delete pressed,
     * delete the character to the right of the separator and reposition the cursor
     */
    if (
      lastKeyStroke === 'Delete' &&
      previousValue[cursorPosition] === groupSeparator
    ) {
      splitValue.splice(cursorPosition, 1);
      cursorPosition += 1;
    }
    modifiedValue = splitValue.join('');

    const cleanValue = removeSeparator(modifiedValue);
    const newFormattedValue = formatInputValueDisplay(cleanValue);

    const newCursorMaybe =
      cursorPosition + (newFormattedValue.length - valueAfterChange.length);
    const newCursor = newCursorMaybe <= 0 ? 0 : newCursorMaybe;

    return { modifiedValue: newFormattedValue, cursorPosition: newCursor };
  }

  const cleanValue = removeSeparator(modifiedValue);
  const newFormattedValue = formatInputValueDisplay(cleanValue);
  return { modifiedValue: newFormattedValue, cursorPosition: selectionStart };
};
