import { NumberDisplay } from '@/components/number-display';
import { NumberTitle } from '@/components/number-title';
import { type ReactNode } from 'react';
import { DEFAULT_DECIMALS } from '@/lib/constants';

interface Props {
  children: ReactNode;
  value: bigint;
  decimals?: number;
  isSvg?: boolean;
  className?: string;
}

export const FullNumber = ({
  children,
  value,
  decimals = DEFAULT_DECIMALS,
  isSvg,
  className,
}: Props) => {
  return (
    <NumberDisplay isSvg={isSvg} className={className}>
      <NumberTitle decimals={decimals} value={value} isSvg={isSvg}>
        {children}
      </NumberTitle>
    </NumberDisplay>
  );
};
