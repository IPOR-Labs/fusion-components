import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isSvg?: boolean;
  className?: string;
}

export const NumberDisplay = ({ children, isSvg, className }: Props) => {
  const classNames = cn(
    'font-source-sans-pro lining-nums tabular-nums',
    className,
  );

  if (isSvg) {
    return <tspan className={classNames}>{children}</tspan>;
  }

  return <span className={classNames}>{children}</span>;
};
