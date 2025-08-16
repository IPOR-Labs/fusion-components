import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { erc20Abi, type Address } from 'viem'
import { useReadContract } from 'wagmi';
import type { ChainId } from '@/app/wagmi';
import { Providers } from '@/app/providers';
import { PlasmaVaultProvider, usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositAsset } from '@/fusion/deposit/deposit-asset/deposit-asset';
import { HybridWithdraw } from '@/fusion/withdraw/hybrid-withdraw/hybrid-withdraw';
import type { AppContextValue } from '@/app/app.context';

export interface Props {
  chainId: ChainId;
  address: Address;
  appConfig: AppContextValue;
}

export const FusionDepositWidget = ({
  address,
  chainId,
  appConfig,
}: Props) => {
  return (
    <div className="dark">
      <Providers appConfig={appConfig}>
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
            <DepositAsset />
          </TabsContent>
          <TabsContent value="withdraw">
            <HybridWithdraw />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
