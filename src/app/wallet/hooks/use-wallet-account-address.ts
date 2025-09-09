import { useAppWalletClient } from "@/app/wallet/hooks/use-app-wallet-client";
import { useQuery } from "@tanstack/react-query";

export const useWalletAccountAddress = () => {
  const walletClient = useAppWalletClient();

  const { data: address } = useQuery({
    queryKey: ['wallet-account-address'],
    queryFn: async () => {
      if (walletClient === undefined) {
        throw new Error('walletClient is undefined');
      }
      const addresses = await walletClient.getAddresses();
      const address = addresses.at(0);
      if (address === undefined) {
        throw new Error('No wallet address found');
      }
      return address;
    },
    enabled: walletClient !== undefined,
  });

  return address;
};