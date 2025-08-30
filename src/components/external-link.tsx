import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  disableDefaultStyles?: boolean;
  testId?: string;
  trusted?: boolean;
}

export const ExternalLink = (props: ExternalLinkProps) => {
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
        'text-ipor-asset hover:underline': !disableDefaultStyles,
      })}
      data-testid={testId}
    >
      {children}
    </a>
  );
};
