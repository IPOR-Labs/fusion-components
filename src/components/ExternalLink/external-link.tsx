import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import styles from './external-link.module.css';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  disableDefaultStyles?: boolean;
  testId?: string;
  trusted?: boolean;
}

export const ExternalLink = (props: Props) => {
  const {
    href,
    children,
    className,
    title,
    disableDefaultStyles,
    testId,
    trusted = false,
  } = props;

  return (
    <a
      title={title}
      href={href}
      target="_blank"
      {...(!trusted && { rel: 'noopener noreferrer' })}
      className={cn(className, {
        [styles.root]: !disableDefaultStyles,
      })}
      data-testid={testId}
    >
      {children}
    </a>
  );
};
