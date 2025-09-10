import { useDebounce } from '@/lib/useDebounce';
import { type ReactNode } from 'react';

interface Props {
  value: string | number;
  children: ReactNode;
  loader: ReactNode;
  delay?: number;
}

export const Debouncer = ({
  value,
  children,
  loader,
  delay,
}: Props) => {
  const debouncedValue = useDebounce(value, delay);
  const isDebouncing = debouncedValue !== value;

  if (isDebouncing) {
    return <>{loader}</>;
  }

  return <>{children}</>;
};
