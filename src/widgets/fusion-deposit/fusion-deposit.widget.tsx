import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositAsset } from '@/fusion/deposit/deposit-asset/deposit-asset';
import { HybridWithdraw } from '@/fusion/withdraw/hybrid-withdraw/hybrid-withdraw';
import { useConfigContext, type ConfigContextValue } from '@/app/config/config.context';
import { Providers } from '@/app/config/providers';

export const FusionDepositWidget = (config: ConfigContextValue) => {
  return (
    <Providers config={config}>
      <Content />
    </Providers>
  )
}

const Content = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();
  const { data: name } = useReadContract({
    chainId,
    address: fusionVaultAddress,
    abi: erc20Abi,
    functionName: 'name',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="withdraw">
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
