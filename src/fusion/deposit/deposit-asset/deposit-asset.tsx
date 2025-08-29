import { DepositAssetContext } from './deposit-asset.context';
import { DepositAssetBody } from './components/deposit-asset-body';
import { useParams } from './deposit-asset.params';
import { useActions } from './deposit-asset.actions';
import { useDepositForm } from './deposit-asset.form';
import { useTransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { erc20Abi, parseEventLogs } from 'viem';

export const DepositAsset = () => {
  const params = useParams({});
  const approveTxState = useTransactionState({
    onSuccess: ({ receipt }) => {
      const logs = parseEventLogs({
        abi: erc20Abi,
        eventName: 'Approval',
        logs: receipt.logs,
      });
      const event = logs[0];
      if (event) {
        const newAllowance = event.args.value;
        params.setAllowanceFromEvent(newAllowance);
      }
    },
  },);
  const depositTxState = useTransactionState();
  const actions = useActions({ 
    params,
    approveTxState,
    depositTxState,
  });
  const form = useDepositForm();

  return (
    <DepositAssetContext.Provider
      value={{
        actions,
        params,
        form,
        approveTxState,
        depositTxState,
      }}
    >
      <DepositAssetBody />
    </DepositAssetContext.Provider>
  );
};
