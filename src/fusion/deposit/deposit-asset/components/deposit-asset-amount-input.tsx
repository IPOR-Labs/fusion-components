import { useDepositAssetContext } from '../deposit-asset.context';
import { AmountInput } from '@/fusion/markets/erc20/components/AmountInput';
import { formatSignificant } from '@/utils/format-significant';
import { parseUnits } from 'viem';

export const DepositAssetAmountInput = () => {
  const {
    params: {
      assetBalance,
      assetDecimals,
      assetSymbol,
      assetAddress,
      chainId,
      maxDeposit,
    },
  } = useDepositAssetContext();

  const validator = (value: string) => {
    if (maxDeposit === undefined || assetDecimals === undefined) {
      return {
        condition: false,
        errorMessage: '',
      };
    }

    const _value = parseUnits(value, assetDecimals);
    return {
      condition: _value > maxDeposit,
      errorMessage: `Max deposit exceeded. Available amount: ${formatSignificant(maxDeposit, assetDecimals)}`,
    };
  };

  return (
    <AmountInput
      chainId={chainId}
      tokenAddress={assetAddress}
      balance={assetBalance || 0n}
      decimals={assetDecimals || 0}
      symbol={assetSymbol || ''}
      label="Deposit amount"
      name="amount"
      isNarrow
      isDisabled={assetDecimals === undefined}
      validator={validator}
    />
  );
};
