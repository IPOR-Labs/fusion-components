import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FusionDepositConfig } from './fusion-deposit.types'
import { erc20Abi, type Address } from 'viem'
import { useReadContract } from 'wagmi';
import type { ChainId } from '@/app/wagmi';
import { Providers } from '@/app/providers';
import { PlasmaVaultProvider, usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Deposit } from '@/fusion/deposit/deposit-asset/deposit-asset';

export interface Props extends FusionDepositConfig {
  chainId: ChainId;
  address: Address;
}

export const FusionDepositWidget = ({
  address,
  chainId,
  connect,
  onError,
  walletClient,
}: Props) => {
  return (
    <div className="dark">
      <Providers>
        <PlasmaVaultProvider chainId={chainId} plasmaVaultAddress={address}>
          <Content />
        </PlasmaVaultProvider>
      </Providers>
    </div>
  )
}

const Content = () => {
  const {
    params: {
      chainId,
      plasmaVaultAddress,
    }
  } = usePlasmaVault();
  const { data: name } = useReadContract({
    chainId,
    address: plasmaVaultAddress,
    abi: erc20Abi,
    functionName: 'name',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit">
          <TabsList>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            <Deposit />
          </TabsContent>
          <TabsContent value="withdraw">Change your password here.</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
