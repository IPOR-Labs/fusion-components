import { formSchema } from '@/fusion/deposit/deposit-asset/deposit-asset.form';
import { useDepositAssetContext } from './deposit-asset.context';
import { parseUnits } from 'viem';
import { calcNeedsApproval } from '@/utils/calc-needs-approval';
import { getNeedsRevokeApproval } from '@/revokeAllowance/utils/getNeedsRevokeApproval';
import { mainnet } from 'viem/chains';
import { USDT_ADDRESS } from '@/fusion/markets/erc20/erc20.addresses';

const useNeedsRevokeBeforeApproval = () => {
  const {
    params: { chainId, assetAddress, allowance, assetDecimals },
    form,
  } = useDepositAssetContext();

  if (chainId !== mainnet.id) {
    return false;
  }
  if (assetAddress !== USDT_ADDRESS[mainnet.id]) {
    return false;
  }
  if (assetDecimals === undefined) {
    return false;
  }

  const newAllowance = parseUnits(form.getValues('amount'), assetDecimals);

  return getNeedsRevokeApproval({
    currentAllowance: allowance,
    newAllowance,
  });
};

export const useSubmit = () => {
  const {
    params: { allowance, assetAddress, assetDecimals },
    actions: { approve, deposit },
    form,
    state: { showRevokeModal },
  } = useDepositAssetContext();

  const needsRevokeBeforeApproval = useNeedsRevokeBeforeApproval();

  const submit = async () => {
    if (assetDecimals === undefined) {
      throw new Error('decimals is undefined');
    }

    const { amount: amountString } = await formSchema.parseAsync(
      form.getValues(),
    );

    const amount = parseUnits(amountString, assetDecimals);

    const needsApproval = calcNeedsApproval({
      allowance,
      amount,
    });

    if (needsApproval) {
      if (assetAddress === undefined) {
        throw new Error('assetAddress is undefined');
      }

      if (needsRevokeBeforeApproval) {
        showRevokeModal();
        return;
      }

      await approve?.({
        amount,
        assetAddress,
      });
      return;
    }

    await deposit?.({ amount });
    form.reset();
  };

  return submit;
};

export const useIsSubmitDisabled = () => {
  const {
    params: { canDeposit },
    form,
  } = useDepositAssetContext();
  const { isDirty, isValid } = form.formState;

  if (canDeposit === false) {
    return true;
  }

  if (isDirty && !isValid) {
    return true;
  }

  return false;
};
