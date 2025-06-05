import { useHasRole } from '@/fusion/access-manager/hooks/useHasRole';
import { useWallet } from '@/wallet/context';

export const useIsAccountWhitelisted = () => {
  const { accountAddress } = useWallet();

  const { data: hasRoleData } = useHasRole({
    accountAddress,
    role: 'WHITELIST_ROLE',
  });

  if (hasRoleData === undefined) {
    return undefined;
  }

  return hasRoleData[0];
};
