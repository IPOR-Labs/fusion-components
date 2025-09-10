import { ScheduledWithdrawContext } from "@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.context";
import { useParams } from "@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.params";
import { useTransactionState } from "@/app/transactions/hooks/use-transaction-state";
import { useActions } from "@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.actions";
import { ScheduledWithdrawContent } from "@/fusion/withdraw/scheduled-withdraw/components/scheduled-withdraw-content";

export const ScheduledWithdraw = () => {
  const params = useParams();
  const txState = useTransactionState();
  const actions = useActions({ txState });

  return (
    <ScheduledWithdrawContext.Provider value={{
      params,
      actions,
      txState,
    }}>
      <ScheduledWithdrawContent />
    </ScheduledWithdrawContext.Provider>
  );
};
