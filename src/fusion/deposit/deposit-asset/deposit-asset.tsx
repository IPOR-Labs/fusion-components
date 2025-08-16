import { PlasmaVaultDepositProvider, useDeposit } from '@/fusion/deposit/deposit-asset/deposit-asset.context';
import { DepositBody } from '@/fusion/deposit/deposit-asset/components/DepositBody';
import { WithdrawNote } from '@/fusion/withdraw/components/WithdrawNote';

export const Deposit = () => {
  return (
    <PlasmaVaultDepositProvider>
      <Content />
    </PlasmaVaultDepositProvider>
  );
};

const Content = () => {
  const {
    params: {
      isScheduledWithdrawal,
      withdrawWindowInSeconds,
      assetSymbol,
    },
  } = useDeposit();

  return (
    <>
      <WithdrawNote
        isScheduledWithdrawal={isScheduledWithdrawal}
        withdrawWindowInSeconds={withdrawWindowInSeconds}
        withdrawTokenSymbol={assetSymbol}
      />
      <DepositBody />
    </>
  )
}
