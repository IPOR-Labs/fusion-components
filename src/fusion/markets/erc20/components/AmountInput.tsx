import { NumberDisplay } from '@/components/number-display';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getValumeOptions } from '@/utils/get-volume-options';
import { StatusIcon } from '@/components/status-icon';
import { type ChainId } from '@/app/wagmi';
import { displayBalance } from '@/utils/display-balance';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { normalizeNumberInput } from '@/utils/normalize-number-input';
import { type Address, formatUnits, parseUnits } from 'viem';

interface Props {
  name: string;
  label: string;
  tokenAddress: Address | undefined;
  chainId: ChainId;
  balance: bigint;
  decimals: number;
  symbol: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isNarrow?: boolean;
  onChangeValue?: (value: string) => void;
  onInteract?: () => void;
  onChangeMax?: (isMax: boolean) => void;
  hideSymbol?: boolean;
  validator?: (value: string) => {
    condition: boolean;
    errorMessage: string;
  };
}

export const AmountInput = ({
  name,
  label,
  tokenAddress,
  chainId,
  balance,
  decimals,
  symbol,
  isDisabled,
  isLoading,
  isError,
  isNarrow,
  onChangeValue,
  onInteract,
  onChangeMax,
  hideSymbol,
  validator,
}: Props) => {
  const { control } = useFormContext();

  return (
    <FormField
      rules={{
        required: 'Enter an amount',
        validate: (value: string) => {
          const _value = parseUnits(value, decimals);
          if (_value <= 0n) {
            return 'Amount must be greater than 0';
          }
          if (_value > balance) {
            return 'Insufficient balance';
          }
          if (validator) {
            const { condition, errorMessage } = validator(value);
            if (condition) {
              return errorMessage;
            }
          }
          return true;
        },
      }}
      control={control}
      name={name}
      render={({ field }) => {
        const volumeOptions = getValumeOptions({
          balance,
          decimals,
          currentValue: field.value,
        });
        const onChange = (newValue: string) => {
          field.onChange(newValue);
          onChangeValue?.(newValue);
        };

        return (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>{label}</FormLabel>
              <button
                disabled={isDisabled}
                onClick={() => {
                  onInteract?.();
                  onChange(formatUnits(balance, decimals));
                  onChangeMax?.(true);
                }}
                type="button"
              >
                <NumberDisplay className="text-xs text-muted-foreground">
                  Available:{' '}
                  {displayBalance({
                    balance,
                    decimals,
                    symbol: hideSymbol ? undefined : symbol,
                  })}
                </NumberDisplay>
              </button>
            </div>
            <div
              className={cn('grid gap-2', {
                'grid-cols-1': isNarrow,
                'grid-cols-2': !isNarrow,
              })}
            >
              <div className="flex items-center">
                <FormControl className="-mr-8">
                  <Input
                    placeholder="0"
                    {...field}
                    onChange={({ target }) => {
                      const textValue = target.value;
                      const newValue = normalizeNumberInput(textValue);

                      if (newValue !== null) {
                        onChange(newValue);
                        onChangeMax?.(false);
                      }
                    }}
                    disabled={isDisabled}
                    onFocus={onInteract}
                  />
                </FormControl>
                <StatusIcon
                  isError={isError}
                  isLoading={isLoading}
                  chainId={chainId}
                  tokenAddress={tokenAddress}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                {volumeOptions.map(({ option, value }) => {
                  const isActive = value === field.value;

                  return (
                    <Button
                      key={option}
                      type="button"
                      onClick={() => {
                        onInteract?.();
                        onChange(value);
                        onChangeMax?.(option === '100');
                      }}
                      className={cn('flex-grow', {
                        'bg-primary-foreground text-primary-background':
                          isActive,
                      })}
                      disabled={isDisabled}
                    >
                      {option}%
                    </Button>
                  );
                })}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
