import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { AmountInput } from '@/components/amount-input';

export const HybridWithdrawAmountInput = () => {
  const {
    params: {
      balanceToWithdraw,
      assetDecimals,
      assetSymbol,
      assetAddress,
    },
    form,
  } = useHybridWithdrawContext();

  return (
    <AmountInput
      tokenAddress={assetAddress}
      balance={balanceToWithdraw || 0n}
      decimals={assetDecimals || 0}
      symbol={assetSymbol || ''}
      label="Amount to withdraw"
      name="amount"
      isNarrow
      isDisabled={assetDecimals === undefined}
      onChangeMax={(isMax) => {
        form.setValue('isMax', isMax);
      }}
    />
  );
};
