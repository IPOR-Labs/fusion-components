import { formSchema } from '@/fusion/deposit/deposit-asset/deposit-asset.form';
import { useDepositAssetContext } from './deposit-asset.context';
import { parseUnits } from 'viem';
import { calcNeedsApproval } from '@/lib/calc-needs-approval';
import { getNeedsRevokeApproval } from '@/app/allowance/utils/get-needs-revoke-approval';
import { mainnet } from 'viem/chains';
import { USDT_ADDRESS } from '@/lib/erc20.addresses';

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
    params: { fusionVaultAddress, allowance, assetAddress, assetDecimals, accountAddress, showRevokingUsdtAllowance },
    actions: { executeApprove, executeDeposit },
    form,
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
        showRevokingUsdtAllowance();
        return;
      }

      await executeApprove?.({
        amount,
        assetAddress,
        fusionVaultAddress,
      });
      return;
    }

    if (accountAddress === undefined) {
      throw new Error('accountAddress is undefined');
    }

    await executeDeposit?.({
      amount,
      fusionVaultAddress,
      beneficiary: accountAddress,
    });
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
