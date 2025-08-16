import { DepositAssetContext, useDepositAssetContext } from './deposit-asset.context';
import { DepositAssetBody } from './components/deposit-asset-body';
import { useContextState } from './deposit-asset.state';
import { useParams } from './deposit-asset.params';
import { useActions } from './deposit-asset.actions';
import { useDepositForm } from './deposit-asset.form';
import { WithdrawNote } from '@/fusion/withdraw/components/WithdrawNote';

export const DepositAsset = () => {
  const params = useParams({});
  const state = useContextState({ params });
  const actions = useActions({ params, state });
  const form = useDepositForm();

  return (
    <DepositAssetContext.Provider
      value={{
        actions,
        params,
        state,
        form,
      }}
    >
      <Content />
    </DepositAssetContext.Provider>
  );
};

const Content = () => {
  const {
    params: {
      isScheduledWithdrawal,
      withdrawWindowInSeconds,
      assetSymbol,
    },
  } = useDepositAssetContext();

  return (
    <>
      <WithdrawNote
        isScheduledWithdrawal={isScheduledWithdrawal}
        withdrawWindowInSeconds={withdrawWindowInSeconds}
        withdrawTokenSymbol={assetSymbol}
      />
      <DepositAssetBody />
    </>
  )
}
