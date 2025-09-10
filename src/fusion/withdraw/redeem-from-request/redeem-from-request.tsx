import { RedeemFromRequestContext } from "@/fusion/withdraw/redeem-from-request/redeem-from-request.context";
import { useParams } from "@/fusion/withdraw/redeem-from-request/redeem-from-request.params";
import { useTransactionState } from "@/app/transactions/hooks/use-transaction-state";
import { useActions } from "@/fusion/withdraw/redeem-from-request/redeem-from-request.actions";
import { RedeemFromRequestContent } from "@/fusion/withdraw/redeem-from-request/components/redeem-from-request-content";

export const RedeemFromRequest = () => {
  const params = useParams();
  const txState = useTransactionState();
  const actions = useActions({ txState });

  return (
    <RedeemFromRequestContext.Provider value={{
      params,
      actions,
      txState,
    }}>
      <RedeemFromRequestContent />
    </RedeemFromRequestContext.Provider>
  );
};
