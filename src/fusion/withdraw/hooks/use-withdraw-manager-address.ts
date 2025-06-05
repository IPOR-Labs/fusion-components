import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { type Address, zeroAddress } from 'viem';
import { AddressTypeSchema } from '@/utils/schema';
import { isNonZeroAddress } from '@/utils/isNonZeroAddress';
import { substrateToAddress } from '@/fusion/substrates/utils/substrate-to-address';

const WITHDRAW_MANAGER_SLOT =
  '0xb37e8684757599da669b8aea811ee2b3693b2582d2c730fab3f4965fa2ec3e11';

interface Args {
  plasmaVaultAddress: Address | undefined;
}

export const useWithdrawManagerAddress = ({ plasmaVaultAddress }: Args) => {
  const {
    params: { chainId },
  } = usePlasmaVault();
  const publicClient = usePublicClient({ chainId });

  const { data: withdrawManagerAddress } = useQuery({
    queryKey: ['useWithdrawManagerAddress', chainId, plasmaVaultAddress],
    queryFn: async () => {
      if (publicClient === undefined) {
        throw new Error('publicClient is undefined');
      }

      if (plasmaVaultAddress === undefined) {
        throw new Error('plasmaVaultAddress is undefined');
      }

      const bytes32Data = await publicClient.getStorageAt({
        address: plasmaVaultAddress,
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
        return AddressTypeSchema.parse(trimmedData);
      }

      /**
       * zero address means no withdraw manager is set
       */
      return zeroAddress;
    },
    enabled: publicClient !== undefined && plasmaVaultAddress !== undefined,
  });

  return withdrawManagerAddress;
};
