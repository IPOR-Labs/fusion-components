import { plasmaVaultAbi } from "@/abi/plasma-vault.abi";
import { useConfigContext } from "@/app/config/config.context";
import { useAppPublicClient } from "@/app/wallet/hooks/use-app-public-client";

export const useConvertToShares = () => {
  const { fusionVaultAddress } = useConfigContext();
  const publicClient = useAppPublicClient();

  const convertToShares = async (assets: bigint) => {
    const shares = await publicClient.readContract({
      address: fusionVaultAddress,
      abi: plasmaVaultAbi,
      functionName: 'convertToShares',
      args: [assets],
    });

    return shares;
  };

  return convertToShares;
};