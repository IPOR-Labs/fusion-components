import { usePlasmaVaultApprove } from '@/fusion/deposit/actions/approve';
import { usePlasmaVaultDeposit } from '@/fusion/deposit/actions/deposit';
import { type Params } from '@/fusion/deposit/deposit-asset/deposit-asset.params';
import { type ContextState } from '@/fusion/deposit/deposit-asset/deposit-asset.state';

interface Args {
  params: Params;
  state: ContextState;
}

export const useActions = ({ state, params }: Args) => {
  const { chainId, plasmaVaultAddress, setAllowanceFromEvent } = params;
  const { approveStateHandlers, depositStateHandlers } = state;

  const { execute: approve } = usePlasmaVaultApprove({
    chainId,
    plasmaVaultAddress,
    transactionStateHandlers: approveStateHandlers,
    onUpateAllowance: setAllowanceFromEvent,
  });

  const { execute: deposit } = usePlasmaVaultDeposit({
    chainId,
    plasmaVaultAddress,
    transactionStateHandlers: depositStateHandlers,
  });

  return {
    approve,
    deposit,
  };
};

export type Actions = ReturnType<typeof useActions>;
