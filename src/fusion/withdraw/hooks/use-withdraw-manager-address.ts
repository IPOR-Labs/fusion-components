import { useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';
import { addressSchema } from '@/lib/schema';
import { isNonZeroAddress } from '@/lib/is-non-zero-address';
import { substrateToAddress } from '@/lib/substrate-to-address';
import { useConfigContext } from "@/app/config/config.context";
import { useAppPublicClient } from '@/app/wallet/hooks/use-app-public-client';

const WITHDRAW_MANAGER_SLOT =
  '0xb37e8684757599da669b8aea811ee2b3693b2582d2c730fab3f4965fa2ec3e11';

export const useWithdrawManagerAddress = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();
  const publicClient = useAppPublicClient();

  const { data: withdrawManagerAddress } = useQuery({
    queryKey: ['withdraw-manager-address', chainId, fusionVaultAddress],
    queryFn: async () => {
      if (publicClient === undefined) {
        throw new Error('publicClient is undefined');
      }

      if (fusionVaultAddress === undefined) {
        throw new Error('plasmaVaultAddress is undefined');
      }

      const bytes32Data = await publicClient.getStorageAt({
        address: fusionVaultAddress,
        slot: WITHDRAW_MANAGER_SLOT,
      });

      if (bytes32Data === undefined) {
        return undefined;
      }

      const trimmedData = substrateToAddress(bytes32Data);

      /**
       * @dev If the address zero
       * then parse on trimmed value '0x00' will throw an error
       * we don't want to throw an error in this case
       */
      if (isNonZeroAddress(trimmedData)) {
        return addressSchema.parse(trimmedData);
      }

      /**
       * zero address means no withdraw manager is set
       */
      return zeroAddress;
    },
    enabled: publicClient !== undefined && fusionVaultAddress !== undefined,
  });

  return withdrawManagerAddress;
};
