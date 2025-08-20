import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import styles from './number-display.module.css';

interface Props {
  children: ReactNode;
  isSvg?: boolean;
  className?: string;
}

export const NumberDisplay = ({ children, isSvg, className }: Props) => {
  const classNames = cn(styles.root, className);

  if (isSvg) {
    return <tspan className={classNames}>{children}</tspan>;
  }

  return <span className={classNames}>{children}</span>;
};
