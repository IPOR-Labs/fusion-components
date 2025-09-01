import { formSchema } from '@/fusion/deposit/deposit-asset/deposit-asset.form';
import { useDepositAssetContext } from './deposit-asset.context';
import { isAddressEqual, parseUnits } from 'viem';
import { calcNeedsApproval } from '@/app/allowance/utils/calc-needs-approval';
import { getNeedsRevokeApproval } from '@/app/allowance/utils/get-needs-revoke-approval';
import { ERC20_TOKENS_TO_REVOKE_BEFORE_APPROVE } from '@/lib/constants';

export const useNeedsRevokeBeforeApproval = () => {
  const {
    params: { chainId, assetAddress, allowance, assetDecimals },
    form,
  } = useDepositAssetContext();

  if (assetDecimals === undefined) return false;
  if (assetAddress === undefined) return false;

  const isRevokeToken = assetAddress && ERC20_TOKENS_TO_REVOKE_BEFORE_APPROVE.some((token) => {
    return token.chainId === chainId && isAddressEqual(token.address, assetAddress);
  });

  if (!isRevokeToken) return false;

  const newAllowance = parseUnits(form.getValues('amount'), assetDecimals);

  return getNeedsRevokeApproval({
    currentAllowance: allowance,
    newAllowance,
  });
};

export const useSubmit = () => {
  const {
    params: { fusionVaultAddress, allowance, assetAddress, assetDecimals, accountAddress },
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
        await executeApprove?.({
          amount: 0n,
          assetAddress,
          spender: fusionVaultAddress,
        });
        return;
      }

      await executeApprove?.({
        amount,
        assetAddress,
        spender: fusionVaultAddress,
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
    params: { isWhitelisted },
    form,
  } = useDepositAssetContext();
  const { isDirty, isValid } = form.formState;

  if (isWhitelisted === false) {
    return true;
  }

  if (isDirty && !isValid) {
    return true;
  }

  return false;
};
