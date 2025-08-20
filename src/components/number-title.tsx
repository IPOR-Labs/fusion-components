import { formatNumber } from '@/lib/format-number';
import { type ReactNode } from 'react';

interface NumberTitleProps {
  children: ReactNode;
  decimals: number;
  value: bigint;
  isSvg?: boolean;
}

export const NumberTitle = (props: NumberTitleProps) => {
  const { children, decimals, value, isSvg } = props;

  if (isSvg) {
    // Bypass if SVG
    // SVG dose not support title attribute
    return <>{children}</>;
  }

  const formattedFullValue = formatNumber(value, decimals, decimals);

  return <span title={formattedFullValue}>{children}</span>;
};
