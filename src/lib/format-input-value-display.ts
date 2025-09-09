export const formatInputValueDisplay = (value: string) => {
  if (value === '') {
    return value;
  }
  const [integerPart = '', decimalPart = ''] = value.split('.');
  const dot = value.includes('.') ? '.' : '';

  const integerPartWithoutSeparator = integerPart.split(',').join('');

  /* .toLocaleString('en-US') returns comma separated number */
  const integerPartWithSeparator =
    (+integerPartWithoutSeparator).toLocaleString('en-US');

  return `${integerPartWithSeparator}${dot}${decimalPart}`;
};

export const removeSeparator = (value: string) => {
  return value.split(',').join('');
};
