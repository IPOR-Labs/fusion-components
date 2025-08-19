import { useHasRole } from '@/fusion/access-manager/hooks/use-has-role';
import { useAppContext } from '@/app/app.context';

const WHITELIST_ROLE = 800n;

export const useIsAccountWhitelisted = () => {
  const { walletClient } = useAppContext();

  const accountAddress = walletClient?.account?.address;

  const { data: hasRoleData } = useHasRole({
    accountAddress,
    role: WHITELIST_ROLE,
  });

  if (hasRoleData === undefined) {
    return undefined;
  }

  return hasRoleData[0];
};
