import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { AmountInput } from '@/fusion/markets/erc20/components/AmountInput';

export const HybridWithdrawAmountInput = () => {
  const {
    params: {
      balanceToWithdraw,
      assetDecimals,
      assetSymbol,
      assetAddress,
      chainId,
    },
    form,
  } = useHybridWithdrawContext();

  return (
    <AmountInput
      chainId={chainId}
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
