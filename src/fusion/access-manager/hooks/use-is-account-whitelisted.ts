import { useHasRole } from '@/fusion/access-manager/hooks/use-has-role';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';

const WHITELIST_ROLE = 800n;

export const useIsAccountWhitelisted = () => {
  const accountAddress = useWalletAccountAddress();

  const { data: hasRoleData } = useHasRole({
    accountAddress,
    role: WHITELIST_ROLE,
  });

  if (hasRoleData === undefined) {
    return undefined;
  }

  return hasRoleData[0];
};
