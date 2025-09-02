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
import { StatusIcon } from '@/components/status-icon';
import { displayBalance } from '@/lib/display-balance';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { normalizeNumberInput } from '@/lib/normalize-number-input';
import { type Address, formatUnits, parseUnits } from 'viem';

const PERCENTAGE_VOLUME_OPTIONS = ['25', '50', '75', '100'] as const;

interface Props {
  name: string;
  label: string;
  tokenAddress: Address | undefined;
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
                className="cursor-pointer"
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
                <FormControl className="-mr-14">
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
                    className="text-3xl md:text-3xl h-16 rounded-xl font-medium px-5"
                  />
                </FormControl>
                <StatusIcon
                  isError={isError}
                  isLoading={isLoading}
                  tokenAddress={tokenAddress}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                {volumeOptions.map(({ option, value }) => {
                  const isActive = value !== '0' && value === field.value;

                  return (
                    <Button
                      key={option}
                      type="button"
                      variant={isActive ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => {
                        onInteract?.();
                        onChange(value);
                        onChangeMax?.(option === '100');
                      }}
                      className="flex-grow"
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

const getValumeOptions = ({
  balance,
  decimals,
  currentValue,
}: {
  balance: bigint;
  decimals: number;
  currentValue: string;
}) => {
  const balanceString = formatUnits(balance, decimals);

  return PERCENTAGE_VOLUME_OPTIONS.map((option) => {
    if (option === '100') {
      return {
        value: balanceString,
        option,
        isActive: balance !== 0n && currentValue === balanceString,
      };
    }

    const value = (balance * BigInt(option)) / 100n;
    const valueString = formatUnits(value, decimals);
    return {
      value: valueString,
      option,
      isActive: balance !== 0n && currentValue === valueString,
    };
  });
};

