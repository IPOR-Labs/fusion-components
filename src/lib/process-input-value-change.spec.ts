import { describe, it, expect } from 'vitest';
import {
  processInputValueChange,
  type ProcessInputValueChangeParams,
  type ProcessInputValueChangeResult,
} from '@/lib/process-input-value-change';
import { INPUT_VALUE_SEPARATOR } from '@/components/number-input';

interface TestCase {
  input: ProcessInputValueChangeParams;
  expected: ProcessInputValueChangeResult;
}

const lastKeyStroke = '';
const groupSeparator = INPUT_VALUE_SEPARATOR;

const testCases: TestCase[] = [
  /* Adding more characters in the input */
  {
    input: {
      previousValue: '10',
      valueAfterChange: '101',
      selectionStart: 3,
      selectionEnd: 3,
      lastKeyStroke,
      groupSeparator,
    },
    expected: {
      cursorPosition: 3,
      modifiedValue: '101',
    },
  },
  {
    input: {
      previousValue: '101',
      valueAfterChange: '1010',
      selectionStart: 4,
      selectionEnd: 4,
      lastKeyStroke,
      groupSeparator,
    },
    expected: {
      cursorPosition: 5,
      modifiedValue: '1,010',
    },
  },
  {
    input: {
      previousValue: '1,010',
      valueAfterChange: '1,0102',
      selectionStart: 6,
      selectionEnd: 6,
      lastKeyStroke,
      groupSeparator,
    },
    expected: {
      cursorPosition: 6,
      modifiedValue: '10,102',
    },
  },
  {
    input: {
      previousValue: '103,102',
      valueAfterChange: '103,1024',
      selectionStart: 8,
      selectionEnd: 8,
      lastKeyStroke,
      groupSeparator,
    },
    expected: {
      cursorPosition: 9,
      modifiedValue: '1,031,024',
    },
  },
  /* Deleting characters from the input */
  {
    input: {
      previousValue: '103,102',
      valueAfterChange: '03,102',
      selectionStart: 0,
      selectionEnd: 0,
      lastKeyStroke: 'Backspace',
      groupSeparator,
    },
    expected: {
      cursorPosition: 0,
      modifiedValue: '3,102',
    },
  },
  /* Cursor to the RIGHT of 2nd comma should remove "2" and position cursor after "0" when deleting with BACKSPACE */
  {
    input: {
      lastKeyStroke: 'Backspace',
      previousValue: '3,102,659',
      valueAfterChange: '3,102659',
      selectionStart: 5,
      selectionEnd: 5,
      groupSeparator,
    },
    expected: {
      cursorPosition: 3,
      modifiedValue: '310,659',
    },
  },
  /* Cursor to the LEFT of 2nd comma should remove "6" and position cursor after "2" when deleting with DELETE */
  {
    input: {
      lastKeyStroke: 'Delete',
      previousValue: '3,102,659',
      valueAfterChange: '3,102659',
      selectionStart: 5,
      selectionEnd: 5,
      groupSeparator,
    },
    expected: {
      cursorPosition: 5,
      modifiedValue: '310,259',
    },
  },
  {
    input: {
      lastKeyStroke: 'Delete',
      previousValue: '312,093',
      valueAfterChange: '312093',
      selectionStart: 3,
      selectionEnd: 3,
      groupSeparator,
    },
    expected: {
      cursorPosition: 4,
      modifiedValue: '31,293',
    },
  },
  {
    input: {
      lastKeyStroke: 'Delete',
      previousValue: '312,093',
      valueAfterChange: '312093',
      selectionStart: 3,
      selectionEnd: 3,
      groupSeparator,
    },
    expected: {
      cursorPosition: 4,
      modifiedValue: '31,293',
    },
  },
  {
    input: {
      lastKeyStroke: 'Backspace',
      previousValue: '630,290,340',
      valueAfterChange: '630,,340',
      selectionStart: 4,
      selectionEnd: 4,
      groupSeparator,
    },
    expected: {
      cursorPosition: 3,
      modifiedValue: '630,340',
    },
  },
  /* Removing ",290" with Backspace */
  {
    input: {
      lastKeyStroke: 'Backspace',
      previousValue: '630,290,340',
      valueAfterChange: '630,340',
      selectionStart: 3,
      selectionEnd: 7,
      groupSeparator,
    },
    expected: {
      cursorPosition: 3,
      modifiedValue: '630,340',
    },
  },
  /* Removing "290," with Backspace */
  {
    input: {
      lastKeyStroke: 'Backspace',
      previousValue: '630,290,340',
      valueAfterChange: '630,340',
      selectionStart: 4,
      selectionEnd: 8,
      groupSeparator,
    },
    expected: {
      cursorPosition: 4,
      modifiedValue: '630,340',
    },
  },
];

describe('processInputValueChange', () => {
  it.each(testCases)('$# test case', (testCase) => {
    const { input, expected } = testCase;
    expect(processInputValueChange(input)).toEqual(expected);
  });
});
