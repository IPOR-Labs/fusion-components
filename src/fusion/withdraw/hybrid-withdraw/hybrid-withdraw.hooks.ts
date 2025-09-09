import { formatUnits, parseUnits } from 'viem';
import { useHybridWithdrawContext } from './hybrid-withdraw.context';
import { minBigInt } from '@/lib/min-bigint';

export const useIsScheduledWithdrawal = () => {
  const {
    params: { maxInstantWithdrawAmount },
  } = useHybridWithdrawContext();
  const amount = useAssetAmount();

  if (amount === undefined) return undefined;
  if (maxInstantWithdrawAmount === undefined) return undefined;

  const isScheduledWithdrawal = amount > maxInstantWithdrawAmount;

  return isScheduledWithdrawal;
};

export const useIsSubmitDisabled = () => {
  const {
    form,
  } = useHybridWithdrawContext();
  const { isDirty, isValid } = form.formState;

  if (isDirty && !isValid) {
    return true;
  }

  return false;
};

export const useAssetAmount = () => {
  const {
    params: { assetDecimals },
    form,
  } = useHybridWithdrawContext();
  const amountString = form.watch('amount');
  const amount =
    assetDecimals !== undefined
      ? parseUnits(amountString, assetDecimals)
      : undefined;
  return amount;
};

export const useSubmit = () => {
  const {
    params: { 
      convertToShares,
      sharesBalance,
    },
    actions: {
      executeWithdraw,
      executeRequestShares,
      executeRedeem,
    },
    form,
  } = useHybridWithdrawContext();
  const amount = useAssetAmount();
  const isScheduledWithdrawal = useIsScheduledWithdrawal();

  const submit = async () => {
    if (amount === undefined) {
      throw new Error('amount is undefined');
    };
    if (isScheduledWithdrawal === undefined) {
      throw new Error('isScheduledWithdrawal is undefined');
    };

    if (isScheduledWithdrawal) {
      if (form.getValues('isMax')) {
        if (sharesBalance === undefined) {
          throw new Error('sharesBalance is undefined');
        }
        await executeRequestShares?.({
          shares: sharesBalance,
        });
        form.reset();
        return;
      }

      const shares = await convertToShares(amount);
      await executeRequestShares?.({ shares });
      form.reset();
      return;
    }

    if (form.getValues('isMax')) {
      if (sharesBalance === undefined) {
        throw new Error('sharesBalance is undefined');
      }
      await executeRedeem?.({
        shares: sharesBalance,
      });
      form.reset();
      return;
    }

    await executeWithdraw?.({ 
      amount,
    });
    form.reset();
  };

  return submit;
};

export const useHandleMaxInstantWithdrawAmount = () => {
  const {
    params: { assetDecimals },
    form,
  } = useHybridWithdrawContext();

  const instantWithdrawAmount = useInstantWithdrawAmount();

  if (instantWithdrawAmount === undefined) return undefined;
  if (assetDecimals === undefined) return undefined;

  const instantWithdrawAmountString = formatUnits(
    instantWithdrawAmount,
    assetDecimals,
  );

  const handleMaxInstantWithdrawAmount = () => {
    form.setValue('amount', instantWithdrawAmountString, { shouldDirty: true });
    form.trigger(['amount']);
  };

  return handleMaxInstantWithdrawAmount;
};

export const useInstantWithdrawAmount = () => {
  const {
    params: { maxInstantWithdrawAmount, balanceToWithdraw },
  } = useHybridWithdrawContext();

  if (maxInstantWithdrawAmount === undefined) return undefined;
  if (balanceToWithdraw === undefined) return undefined;

  const instantWithdrawAmount = minBigInt(
    maxInstantWithdrawAmount,
    balanceToWithdraw,
  );

  return instantWithdrawAmount;
};

export const useSubmitButtonLabel = () => {
  const {
    params: { isWithdrawRequestPending },
    form,
  } = useHybridWithdrawContext();
  const isDisabled = useIsSubmitDisabled();
  const isScheduledWithdrawal = useIsScheduledWithdrawal();
  const isMaxRedeem = form.getValues('isMax');

  if (isDisabled) return 'Withdraw';

  if (isScheduledWithdrawal) {
    return isWithdrawRequestPending
      ? 'Update Withdrawal'
      : 'Schedule Withdrawal';
  }
  return isMaxRedeem ? 'Withdraw All Now' : 'Withdraw Now';
};
