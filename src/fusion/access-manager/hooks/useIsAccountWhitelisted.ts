import { useHasRole } from '@/fusion/access-manager/hooks/useHasRole';
import { useWalletContext } from '@/wallet/context';

export const useIsAccountWhitelisted = () => {
  const { accountAddress } = useWalletContext();

  const { data: hasRoleData } = useHasRole({
    accountAddress,
    role: 'WHITELIST_ROLE',
  });

  if (hasRoleData === undefined) {
    return undefined;
  }

  return hasRoleData[0];
};
