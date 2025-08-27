import { type ChainId } from '@/app/config/wagmi';
import { useRevokeTokenAllowance } from '@/app/allowance/hooks/use-revoke-token-allowance';
import { useState } from 'react';
import { parseEventLogs, erc20Abi, type Address, type TransactionReceipt } from 'viem';

interface Args {
  chainId: ChainId;
  tokenAddress: Address;
  spender: Address;
  newAllowance: bigint;
  onDone: () => void;
  onUpdateAllowance: (newAllowance: bigint) => void;
}

export const useParams = ({
  chainId,
  tokenAddress,
  spender,
  newAllowance,
  onDone,
  onUpdateAllowance,
}: Args) => {
  const allowance = useRevokeTokenAllowance({ chainId, tokenAddress, spender });

  const [allowanceFromEvent, setAllowanceFromEvent] = useState<bigint>();

  const handleUpdateAllowance = (receipt: TransactionReceipt) => {
    const logs = parseEventLogs({
      abi: erc20Abi,
      eventName: 'Approval',
      logs: receipt.logs,
    });
    const event = logs[0];
    if (event) {
      const newAllowance = event.args.value;
      setAllowanceFromEvent(newAllowance);
      onUpdateAllowance(newAllowance);
    }
  };

  return {
    chainId,
    tokenAddress,
    spender,
    currentAllowance: allowanceFromEvent ?? allowance,
    newAllowance,
    onDone,
    handleUpdateAllowance,
  };
};

export type Params = ReturnType<typeof useParams>;
